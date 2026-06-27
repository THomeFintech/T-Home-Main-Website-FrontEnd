import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// ADD THIS HERE
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "";

    if (
      status === 401 ||
      message.toLowerCase().includes("expired") ||
      message.toLowerCase().includes("token")
    ) {
      

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      window.dispatchEvent(new Event("authChange"));

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);
export const getApiErrorMessage = (error) => {
  if (error?.response?.data?.detail) {
    if (typeof error.response.data.detail === "string") {
      return error.response.data.detail;
    }
    return JSON.stringify(error.response.data.detail);
  }
  return error?.message || "Something went wrong";
};

export default apiClient;
