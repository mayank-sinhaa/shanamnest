from django.contrib import admin
from .models import MemberProfile


@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "mobile_number",
        "city",
        "service_type",
        "is_verified",
        "created_at",
    )
    list_filter = ("service_type", "is_verified", "created_at")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__email",
        "mobile_number",
        "city",
    )
    readonly_fields = ("created_at",)