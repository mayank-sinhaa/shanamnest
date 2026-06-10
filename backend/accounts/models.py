from django.db import models
from django.contrib.auth.models import User


class MemberProfile(models.Model):
    SERVICE_CHOICES = [
        ("newborn_care", "Newborn Care Support"),
        ("member_portal", "Family Member Portal"),
        ("grievance_assistance", "Grievance Assistance"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="member_profile",
    )
    mobile_number = models.CharField(max_length=15)
    city = models.CharField(max_length=120, blank=True)
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES, blank=True)
    address = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    mobile_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class RegistrationOTP(models.Model):
    email = models.EmailField()
    mobile_number = models.CharField(max_length=15)

    email_otp_hash = models.CharField(max_length=255)
    mobile_otp_hash = models.CharField(max_length=255)

    attempts = models.PositiveIntegerField(default=0)
    is_used = models.BooleanField(default=False)

    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OTP for {self.email} / {self.mobile_number}"