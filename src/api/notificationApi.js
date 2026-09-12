import apiClient from "./client";

const notificationApi = {
  getNotifications: async () => {
    const response = await apiClient.get("/dashboard/notifications");
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(
      `/dashboard/notifications/${notificationId}/read`,
    );
    return response.data;
  },
};

export default notificationApi;
