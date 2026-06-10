from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegisterView,
    MyProfileView,
    RequestRegistrationOTPView,
    VerifyRegistrationOTPView,
    RequestPasswordResetOTPView,
    VerifyPasswordResetOTPView,
    AdminMemberListView,
    CurrentUserView,
)

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current_user"),

    path("register/", RegisterView.as_view(), name="register"),
    path(
        "register/request-otp/",
        RequestRegistrationOTPView.as_view(),
        name="request_register_otp",
    ),
    path(
        "register/verify-otp/",
        VerifyRegistrationOTPView.as_view(),
        name="verify_register_otp",
    ),

    path(
        "password-reset/request-otp/",
        RequestPasswordResetOTPView.as_view(),
        name="request_password_reset_otp",
    ),
    path(
        "password-reset/verify-otp/",
        VerifyPasswordResetOTPView.as_view(),
        name="verify_password_reset_otp",
    ),

    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", MyProfileView.as_view(), name="my_profile"),

    path("admin/members/", AdminMemberListView.as_view(), name="admin_members"),
]