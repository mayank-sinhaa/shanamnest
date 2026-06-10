from django.contrib import admin
from .models import Grievance, GrievanceReply


class GrievanceReplyInline(admin.TabularInline):
    model = GrievanceReply
    extra = 0
    readonly_fields = ("created_at",)


@admin.register(Grievance)
class GrievanceAdmin(admin.ModelAdmin):
    list_display = (
        "ticket_id",
        "member",
        "subject",
        "category",
        "priority",
        "status",
        "created_at",
        "updated_at",
    )
    list_filter = ("category", "priority", "status", "created_at")
    search_fields = (
        "ticket_id",
        "subject",
        "description",
        "member__username",
        "member__email",
    )
    readonly_fields = ("ticket_id", "created_at", "updated_at")
    inlines = [GrievanceReplyInline]


@admin.register(GrievanceReply)
class GrievanceReplyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "grievance",
        "sender",
        "is_admin_reply",
        "created_at",
    )
    list_filter = ("is_admin_reply", "created_at")
    search_fields = (
        "grievance__ticket_id",
        "sender__username",
        "message",
    )
    readonly_fields = ("created_at",)