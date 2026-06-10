from rest_framework import generics, permissions

from .models import ContactMessage, LiveChatSchedule
from .serializers import (
    ContactMessageSerializer,
    LiveChatScheduleSerializer,
    AdminContactStatusUpdateSerializer,
    AdminLiveChatStatusUpdateSerializer,
)


class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]


class LiveChatScheduleCreateView(generics.CreateAPIView):
    queryset = LiveChatSchedule.objects.all()
    serializer_class = LiveChatScheduleSerializer
    permission_classes = [permissions.AllowAny]


class AdminContactMessageListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminLiveChatScheduleListView(generics.ListAPIView):
    queryset = LiveChatSchedule.objects.all().order_by("-created_at")
    serializer_class = LiveChatScheduleSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminContactMessageUpdateView(generics.UpdateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = AdminContactStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminLiveChatScheduleUpdateView(generics.UpdateAPIView):
    queryset = LiveChatSchedule.objects.all()
    serializer_class = AdminLiveChatStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]