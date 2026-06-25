import secrets
from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import MemberProfile, RegistrationOTP
from .serializers import (
    RegisterSerializer,
    MemberProfileSerializer,
    RequestRegistrationOTPSerializer,
    VerifyRegistrationOTPSerializer,
    AdminMemberListSerializer,
    CurrentUserSerializer,
    RequestPasswordResetOTPSerializer,
    VerifyPasswordResetOTPSerializer,
    PASSWORD_RESET_MOBILE_KEY,
)


def generate_otp():
    return str(secrets.randbelow(900000) + 100000)


def send_mobile_otp_development(mobile_number, otp):
    print("\n================ MOBILE OTP DEVELOPMENT MODE ================")
    print(f"Mobile Number: {mobile_number}")
    print(f"Mobile OTP: {otp}")
    print("=============================================================\n")


def print_password_reset_otp(email, otp):
    print("\n================ PASSWORD RESET OTP DEVELOPMENT MODE ================")
    print(f"Email: {email}")
    print(f"Password Reset OTP: {otp}")
    print("====================================================================\n")


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class RequestRegistrationOTPView(generics.GenericAPIView):
    serializer_class = RequestRegistrationOTPSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            mobile_number = serializer.validated_data["mobile_number"]

            email_otp = generate_otp()
            mobile_otp = generate_otp()

            RegistrationOTP.objects.filter(
                email=email,
                mobile_number=mobile_number,
                is_used=False,
            ).update(is_used=True)

            RegistrationOTP.objects.create(
                email=email,
                mobile_number=mobile_number,
                email_otp_hash=make_password(email_otp),
                mobile_otp_hash=make_password(mobile_otp),
                expires_at=timezone.now() + timedelta(minutes=10),
            )

            send_mail(
                subject="Your ShanamNest Email Verification OTP",
                message=(
                    f"Your ShanamNest email verification OTP is {email_otp}. "
                    f"This OTP is valid for 10 minutes."
                ),
                from_email=None,
                recipient_list=[email],
                fail_silently=False,
            )

            send_mobile_otp_development(mobile_number, mobile_otp)

            return Response(
                {
                    "message": (
                        "OTP sent successfully. Email OTP is sent to email. "
                        "Mobile OTP is printed in backend terminal in development mode."
                    )
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyRegistrationOTPView(generics.CreateAPIView):
    serializer_class = VerifyRegistrationOTPSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "Account verified and created successfully."},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequestPasswordResetOTPView(generics.GenericAPIView):
    serializer_class = RequestPasswordResetOTPSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            otp = generate_otp()

            RegistrationOTP.objects.filter(
                email=email,
                mobile_number=PASSWORD_RESET_MOBILE_KEY,
                is_used=False,
            ).update(is_used=True)

            RegistrationOTP.objects.create(
                email=email,
                mobile_number=PASSWORD_RESET_MOBILE_KEY,
                email_otp_hash=make_password(otp),
                mobile_otp_hash=make_password(otp),
                expires_at=timezone.now() + timedelta(minutes=10),
            )

            send_mail(
                subject="Your ShanamNest Password Reset OTP",
                message=(
                    f"Your ShanamNest password reset OTP is {otp}. "
                    f"This OTP is valid for 10 minutes."
                ),
                from_email=None,
                recipient_list=[email],
                fail_silently=False,
            )

            print_password_reset_otp(email, otp)

            return Response(
                {
                    "message": (
                        "Password reset OTP sent successfully. "
                        "In development mode, OTP is also printed in backend terminal."
                    )
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyPasswordResetOTPView(generics.GenericAPIView):
    serializer_class = VerifyPasswordResetOTPSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "Password reset successfully. Please login again."},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MemberProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = MemberProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "mobile_number": "",
                "city": "",
                "service_type": "",
            },
        )
        return profile


class AdminMemberListView(generics.ListAPIView):
    serializer_class = AdminMemberListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return MemberProfile.objects.select_related("user").all().order_by("-created_at")


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = CurrentUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user