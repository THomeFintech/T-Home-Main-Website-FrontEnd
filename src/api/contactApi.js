import apiClient from "./client";

const contactApi = {
  // POST /contact-form/
  saveContactForm: async (payload) => {
    const response = await apiClient.post("/contact-form/", payload);
    return response.data;
  },
};

export default contactApi;