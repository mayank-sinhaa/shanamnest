const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.detail ||
      data?.message ||
      data?.non_field_errors?.[0] ||
      Object.values(data || {})?.[0]?.[0] ||
      "Something went wrong. Please try again.";

    throw new Error(errorMessage);
  }

  return data;
};

export const authAPI = {
  register: (formData) =>
    apiRequest("/accounts/register/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  requestRegisterOTP: (formData) =>
    apiRequest("/accounts/register/request-otp/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  verifyRegisterOTP: (formData) =>
    apiRequest("/accounts/register/verify-otp/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  requestPasswordResetOTP: (formData) =>
    apiRequest("/accounts/password-reset/request-otp/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  verifyPasswordResetOTP: (formData) =>
    apiRequest("/accounts/password-reset/verify-otp/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  login: (formData) =>
    apiRequest("/accounts/login/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  currentUser: () => apiRequest("/accounts/me/"),

  profile: () => apiRequest("/accounts/profile/"),

  adminMembers: () => apiRequest("/accounts/admin/members/"),
};

export const grievanceAPI = {
  submit: (formData) =>
    apiRequest("/grievances/submit/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  myGrievances: () => apiRequest("/grievances/my/"),

  myGrievanceDetail: (ticketId) =>
    apiRequest(`/grievances/my/${ticketId}/`),

  adminGrievances: () => apiRequest("/grievances/admin/"),

  adminUpdateGrievance: (ticketId, formData) =>
    apiRequest(`/grievances/admin/${ticketId}/`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    }),

  adminReply: (ticketId, formData) =>
    apiRequest(`/grievances/admin/${ticketId}/reply/`, {
      method: "POST",
      body: JSON.stringify(formData),
    }),
};

export const supportAPI = {
  contact: (formData) =>
    apiRequest("/support/contact/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  liveChat: (formData) =>
    apiRequest("/support/live-chat/", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  adminContactMessages: () =>
    apiRequest("/support/admin/contact-messages/"),

  updateContactMessageStatus: (id, formData) =>
    apiRequest(`/support/admin/contact-messages/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    }),

  adminLiveChats: () => apiRequest("/support/admin/live-chats/"),

  updateLiveChatStatus: (id, formData) =>
    apiRequest(`/support/admin/live-chats/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    }),

  adminDashboardStats: () =>
    apiRequest("/support/admin/dashboard-stats/"),
};