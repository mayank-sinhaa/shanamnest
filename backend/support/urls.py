from django.urls import path

from .views import (
    ContactMessageCreateView,
    LiveChatScheduleCreateView,
    AdminContactMessageListView,
    AdminLiveChatScheduleListView,
    AdminContactMessageUpdateView,
    AdminLiveChatScheduleUpdateView,
)

from .dashboard_views import AdminDashboardStatsView


urlpatterns = [
    path("contact/", ContactMessageCreateView.as_view(), name="contact_message"),
    path("live-chat/", LiveChatScheduleCreateView.as_view(), name="live_chat_schedule"),

    path(
        "admin/contact-messages/",
        AdminContactMessageListView.as_view(),
        name="admin_contact_messages",
    ),
    path(
        "admin/contact-messages/<int:pk>/",
        AdminContactMessageUpdateView.as_view(),
        name="admin_contact_message_update",
    ),

    path(
        "admin/live-chats/",
        AdminLiveChatScheduleListView.as_view(),
        name="admin_live_chats",
    ),
    path(
        "admin/live-chats/<int:pk>/",
        AdminLiveChatScheduleUpdateView.as_view(),
        name="admin_live_chat_update",
    ),

    path(
        "admin/dashboard-stats/",
        AdminDashboardStatsView.as_view(),
        name="admin_dashboard_stats",
    ),
]