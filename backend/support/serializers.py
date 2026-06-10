import re
from datetime import datetime

from django.utils import timezone
from rest_framework import serializers

from .models import ContactMessage, LiveChatSchedule


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "subject",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_phone(self, value):
        if value and not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Please enter a valid 10 digit Indian mobile number."
            )
        return value


class LiveChatScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveChatSchedule
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "topic",
            "preferred_date",
            "preferred_time",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_phone(self, value):
        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Please enter a valid 10 digit Indian mobile number."
            )
        return value

    def validate(self, data):
        preferred_date = data.get("preferred_date")
        preferred_time = data.get("preferred_time")

        if preferred_date and preferred_time:
            selected_datetime = datetime.combine(preferred_date, preferred_time)
            selected_datetime = timezone.make_aware(
                selected_datetime,
                timezone.get_current_timezone(),
            )

            if selected_datetime <= timezone.now():
                raise serializers.ValidationError(
                    "Live chat can only be scheduled for a future date and time."
                )

        return data


class AdminContactStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["status"]


class AdminLiveChatStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveChatSchedule
        fields = ["status"]