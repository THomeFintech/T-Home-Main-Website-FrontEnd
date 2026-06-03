import apiClient from "./client";

const authApi = {
  register: async (payload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await apiClient.post("/auth/login", payload);

    if (response.data?.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }

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