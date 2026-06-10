from django.db import models


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ("new", "New"),
        ("read", "Read"),
        ("replied", "Replied"),
    ]

    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.subject}"


class LiveChatSchedule(models.Model):
    TOPIC_CHOICES = [
        ("newborn_care", "Newborn Care Support"),
        ("membership", "Membership Help"),
        ("grievance", "Grievance Guidance"),
        ("account", "Account / Login Issue"),
        ("general", "General Support"),
    ]

    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    topic = models.CharField(max_length=50, choices=TOPIC_CHOICES)
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.preferred_date} {self.preferred_time}"