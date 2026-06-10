from django.contrib import admin
from .models import ContactMessage, LiveChatSchedule


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "email",
        "phone",
        "subject",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("full_name", "email", "phone", "subject", "message")
    readonly_fields = ("created_at",)


@admin.register(LiveChatSchedule)
class LiveChatScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "email",
        "phone",
        "topic",
        "preferred_date",
        "preferred_time",
        "status",
        "created_at",
    )
    list_filter = ("topic", "status", "preferred_date", "created_at")
    search_fields = ("full_name", "email", "phone", "message")
    readonly_fields = ("created_at",)