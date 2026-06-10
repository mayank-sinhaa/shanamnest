from rest_framework import serializers
from .models import Grievance, GrievanceReply


class GrievanceReplySerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.get_full_name", read_only=True)

    class Meta:
        model = GrievanceReply
        fields = [
            "id",
            "grievance",
            "sender",
            "sender_name",
            "message",
            "is_admin_reply",
            "created_at",
        ]
        read_only_fields = ["id", "sender", "is_admin_reply", "created_at"]


class GrievanceSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.get_full_name", read_only=True)
    member_email = serializers.EmailField(source="member.email", read_only=True)
    replies = GrievanceReplySerializer(many=True, read_only=True)

    class Meta:
        model = Grievance
        fields = [
            "id",
            "ticket_id",
            "member",
            "member_name",
            "member_email",
            "subject",
            "category",
            "description",
            "priority",
            "status",
            "admin_note",
            "attachment",
            "replies",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "ticket_id",
            "member",
            "admin_note",
            "created_at",
            "updated_at",
        ]


class AdminGrievanceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grievance
        fields = ["status", "priority", "admin_note"]


class AdminReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = GrievanceReply
        fields = ["message"]