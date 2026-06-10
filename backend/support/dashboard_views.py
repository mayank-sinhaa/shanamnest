from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from accounts.models import MemberProfile
from grievances.models import Grievance
from support.models import ContactMessage, LiveChatSchedule


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_members = MemberProfile.objects.count()

        total_grievances = Grievance.objects.count()
        pending_grievances = Grievance.objects.filter(status="pending").count()
        in_progress_grievances = Grievance.objects.filter(
            status="in_progress"
        ).count()
        resolved_grievances = Grievance.objects.filter(status="resolved").count()
        closed_grievances = Grievance.objects.filter(status="closed").count()

        contact_messages = ContactMessage.objects.count()
        new_contact_messages = ContactMessage.objects.filter(status="new").count()

        live_chat_requests = LiveChatSchedule.objects.count()
        scheduled_live_chats = LiveChatSchedule.objects.filter(
            status="scheduled"
        ).count()

        return Response(
            {
                "users": {
                    "total_users": total_users,
                    "total_members": total_members,
                },
                "grievances": {
                    "total": total_grievances,
                    "pending": pending_grievances,
                    "in_progress": in_progress_grievances,
                    "resolved": resolved_grievances,
                    "closed": closed_grievances,
                },
                "support": {
                    "contact_messages": contact_messages,
                    "new_contact_messages": new_contact_messages,
                    "live_chat_requests": live_chat_requests,
                    "scheduled_live_chats": scheduled_live_chats,
                },
            }
        )