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
  // Authentication
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");

  // Loan & Balance Transfer
  localStorage.removeItem("loanReference");
  localStorage.removeItem("applicationReference");
  localStorage.removeItem("loanData");
  localStorage.removeItem("report");
  localStorage.removeItem("recommendations");
  localStorage.removeItem("selectedJob");

  // Notify app
  window.dispatchEvent(new Event("authChange"));

  // Optional: Redirect to login
  window.location.replace("/login");
},
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authApi;
