import apiClient from "./client";

const authApi = {
  register: async (payload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await apiClient.post("/auth/login", payload);

    if (response.data?.token) {
      localStorage.setItem("access_token", response.data.token);
    }

    return response.data;
  },

  verifyOtp: async (payload) => {
    const response = await apiClient.post("/auth/verify-otp", payload);

    if (response.data?.token) {
      localStorage.setItem("access_token", response.data.token);
    }

    return response.data;
  },

  resendOtp: async (payload) => {
    const response = await apiClient.post("/auth/resend-otp", payload);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
  },

  getToken: () => {
    return localStorage.getItem("access_token");
  },
};

export default authApi;