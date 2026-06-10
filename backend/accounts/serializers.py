import re

from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from rest_framework import serializers

from .models import MemberProfile, RegistrationOTP


SERVICE_CHOICES = [
    ("newborn_care", "Newborn Care Support"),
    ("member_portal", "Family Member Portal"),
    ("grievance_assistance", "Grievance Assistance"),
]


PASSWORD_RESET_MOBILE_KEY = "password_reset"


class MemberProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = MemberProfile
        fields = [
            "id",
            "username",
            "full_name",
            "email",
            "mobile_number",
            "city",
            "service_type",
            "address",
            "is_verified",
            "email_verified",
            "mobile_verified",
            "created_at",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    mobile_number = serializers.CharField(write_only=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True)
    service_type = serializers.ChoiceField(
        choices=SERVICE_CHOICES,
        write_only=True,
        required=False,
        allow_blank=True,
    )
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "mobile_number",
            "city",
            "service_type",
            "password",
            "confirm_password",
        ]

    def validate_mobile_number(self, value):
        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Please enter a valid 10 digit Indian mobile number."
            )
        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "Password and confirm password do not match."
            )

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already registered.")

        return data

    def create(self, validated_data):
        full_name = validated_data.pop("full_name")
        mobile_number = validated_data.pop("mobile_number")
        city = validated_data.pop("city", "")
        service_type = validated_data.pop("service_type", "")
        password = validated_data.pop("password")
        validated_data.pop("confirm_password")

        name_parts = full_name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        email = validated_data["email"]

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        MemberProfile.objects.create(
            user=user,
            mobile_number=mobile_number,
            city=city,
            service_type=service_type,
        )

        return user


class RequestRegistrationOTPSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    email = serializers.EmailField()
    mobile_number = serializers.CharField()
    city = serializers.CharField(required=False, allow_blank=True)
    service_type = serializers.ChoiceField(
        choices=SERVICE_CHOICES,
        required=False,
        allow_blank=True,
    )
    password = serializers.CharField(min_length=6)
    confirm_password = serializers.CharField(min_length=6)

    def validate_mobile_number(self, value):
        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Please enter a valid 10 digit Indian mobile number."
            )
        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "Password and confirm password do not match."
            )

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already registered.")

        if MemberProfile.objects.filter(mobile_number=data["mobile_number"]).exists():
            raise serializers.ValidationError("Mobile number already registered.")

        return data


class VerifyRegistrationOTPSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    email = serializers.EmailField()
    mobile_number = serializers.CharField()
    city = serializers.CharField(required=False, allow_blank=True)
    service_type = serializers.ChoiceField(
        choices=SERVICE_CHOICES,
        required=False,
        allow_blank=True,
    )
    password = serializers.CharField(min_length=6)
    confirm_password = serializers.CharField(min_length=6)
    email_otp = serializers.CharField(min_length=6, max_length=6)
    mobile_otp = serializers.CharField(min_length=6, max_length=6)

    def validate_mobile_number(self, value):
        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Please enter a valid 10 digit Indian mobile number."
            )
        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "Password and confirm password do not match."
            )

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already registered.")

        if MemberProfile.objects.filter(mobile_number=data["mobile_number"]).exists():
            raise serializers.ValidationError("Mobile number already registered.")

        otp_record = (
            RegistrationOTP.objects.filter(
                email=data["email"],
                mobile_number=data["mobile_number"],
                is_used=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_record:
            raise serializers.ValidationError("Please request OTP first.")

        if otp_record.expires_at < timezone.now():
            raise serializers.ValidationError("OTP expired. Please request a new OTP.")

        if otp_record.attempts >= 5:
            raise serializers.ValidationError(
                "Too many wrong attempts. Please request a new OTP."
            )

        email_valid = check_password(data["email_otp"], otp_record.email_otp_hash)
        mobile_valid = check_password(data["mobile_otp"], otp_record.mobile_otp_hash)

        if not email_valid or not mobile_valid:
            otp_record.attempts += 1
            otp_record.save(update_fields=["attempts"])
            raise serializers.ValidationError("Invalid email or mobile OTP.")

        data["otp_record"] = otp_record
        return data

    def create(self, validated_data):
        otp_record = validated_data.pop("otp_record")

        full_name = validated_data.pop("full_name")
        mobile_number = validated_data.pop("mobile_number")
        city = validated_data.pop("city", "")
        service_type = validated_data.pop("service_type", "")
        password = validated_data.pop("password")
        validated_data.pop("confirm_password")
        validated_data.pop("email_otp")
        validated_data.pop("mobile_otp")

        email = validated_data["email"]

        name_parts = full_name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        MemberProfile.objects.create(
            user=user,
            mobile_number=mobile_number,
            city=city,
            service_type=service_type,
            is_verified=True,
            email_verified=True,
            mobile_verified=True,
        )

        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])

        return user


class RequestPasswordResetOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No account found with this email.")
        return value


class VerifyPasswordResetOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)
    new_password = serializers.CharField(min_length=6)
    confirm_password = serializers.CharField(min_length=6)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "New password and confirm password do not match."
            )

        user = User.objects.filter(email=data["email"]).first()

        if not user:
            raise serializers.ValidationError("No account found with this email.")

        otp_record = (
            RegistrationOTP.objects.filter(
                email=data["email"],
                mobile_number=PASSWORD_RESET_MOBILE_KEY,
                is_used=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_record:
            raise serializers.ValidationError("Please request password reset OTP first.")

        if otp_record.expires_at < timezone.now():
            raise serializers.ValidationError("OTP expired. Please request a new OTP.")

        if otp_record.attempts >= 5:
            raise serializers.ValidationError(
                "Too many wrong attempts. Please request a new OTP."
            )

        otp_valid = check_password(data["otp"], otp_record.email_otp_hash)

        if not otp_valid:
            otp_record.attempts += 1
            otp_record.save(update_fields=["attempts"])
            raise serializers.ValidationError("Invalid OTP.")

        data["user"] = user
        data["otp_record"] = otp_record
        return data

    def save(self):
        user = self.validated_data["user"]
        otp_record = self.validated_data["otp_record"]
        new_password = self.validated_data["new_password"]

        user.set_password(new_password)
        user.save(update_fields=["password"])

        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])

        return user


class AdminMemberListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    joined_date = serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model = MemberProfile
        fields = [
            "id",
            "username",
            "full_name",
            "email",
            "mobile_number",
            "city",
            "service_type",
            "address",
            "is_verified",
            "email_verified",
            "mobile_verified",
            "is_active",
            "joined_date",
            "created_at",
        ]


class CurrentUserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "is_staff",
            "is_superuser",
            "is_active",
        ]