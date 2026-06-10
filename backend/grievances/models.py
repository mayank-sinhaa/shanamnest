from django.db import models
from django.contrib.auth.models import User


class Grievance(models.Model):
    CATEGORY_CHOICES = [
        ("newborn_care", "Newborn Care Support"),
        ("membership", "Membership Issue"),
        ("service", "Service Issue"),
        ("account", "Account / Login Issue"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="grievances")
    ticket_id = models.CharField(max_length=30, unique=True, blank=True)
    subject = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    admin_note = models.TextField(blank=True)
    attachment = models.FileField(upload_to="grievance_attachments/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            last_id = Grievance.objects.count() + 1
            self.ticket_id = f"SN-{1000 + last_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_id} - {self.subject}"


class GrievanceReply(models.Model):
    grievance = models.ForeignKey(Grievance, on_delete=models.CASCADE, related_name="replies")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="grievance_replies")
    message = models.TextField()
    is_admin_reply = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply on {self.grievance.ticket_id}"