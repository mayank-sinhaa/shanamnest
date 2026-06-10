from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Grievance, GrievanceReply
from .serializers import (
    GrievanceSerializer,
    AdminGrievanceUpdateSerializer,
    AdminReplySerializer,
)


class SubmitGrievanceView(generics.CreateAPIView):
    serializer_class = GrievanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)


class MyGrievanceListView(generics.ListAPIView):
    serializer_class = GrievanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Grievance.objects.filter(member=self.request.user).order_by("-created_at")


class MyGrievanceDetailView(generics.RetrieveAPIView):
    serializer_class = GrievanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "ticket_id"

    def get_queryset(self):
        return Grievance.objects.filter(member=self.request.user)


class AdminGrievanceListView(generics.ListAPIView):
    serializer_class = GrievanceSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Grievance.objects.all().order_by("-created_at")


class AdminGrievanceDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = GrievanceSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "ticket_id"

    def get_queryset(self):
        return Grievance.objects.all()

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return AdminGrievanceUpdateSerializer
        return GrievanceSerializer


class AdminReplyView(generics.CreateAPIView):
    serializer_class = AdminReplySerializer
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, ticket_id):
        grievance = generics.get_object_or_404(Grievance, ticket_id=ticket_id)
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            GrievanceReply.objects.create(
                grievance=grievance,
                sender=request.user,
                message=serializer.validated_data["message"],
                is_admin_reply=True,
            )

            return Response(
                {"message": "Reply sent successfully."},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)