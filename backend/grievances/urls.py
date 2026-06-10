from django.urls import path
from .views import (
    SubmitGrievanceView,
    MyGrievanceListView,
    MyGrievanceDetailView,
    AdminGrievanceListView,
    AdminGrievanceDetailView,
    AdminReplyView,
)

urlpatterns = [
    path("submit/", SubmitGrievanceView.as_view(), name="submit_grievance"),
    path("my/", MyGrievanceListView.as_view(), name="my_grievances"),
    path("my/<str:ticket_id>/", MyGrievanceDetailView.as_view(), name="my_grievance_detail"),

    path("admin/", AdminGrievanceListView.as_view(), name="admin_grievances"),
    path("admin/<str:ticket_id>/", AdminGrievanceDetailView.as_view(), name="admin_grievance_detail"),
    path("admin/<str:ticket_id>/reply/", AdminReplyView.as_view(), name="admin_reply"),
]