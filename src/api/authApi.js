import apiClient from "./client";

const authApi = {
  register: async (payload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await apiClient.post("/auth/login", payload);

   if (response.data?.access_token) {
  localStorage.setItem("token", response.data.access_token);
  localStorage.setItem("isLoggedIn", "true");
}

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");

  window.dispatchEvent(new Event("authChange"));
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authApi;
