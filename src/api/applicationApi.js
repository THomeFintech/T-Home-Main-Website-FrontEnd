import apiClient from "./client";

const applicationApi = {
  createDraft: async (payload) => {
    const response = await apiClient.post("/application/draft", payload);
    return response.data;
  },

  getApplication: async (applicationReference) => {
    const response = await apiClient.get(`/application/${applicationReference}`);
    return response.data;
  },

  updateApplication: async (applicationReference, payload) => {
    const response = await apiClient.patch(
      `/application/${applicationReference}`,
      payload
    );
    return response.data;
  },

  getApplicationStatus: async (applicationReference) => {
    const response = await apiClient.get(
      `/application/${applicationReference}/status`
    );
    return response.data;
  },

  submitApplication: async (applicationReference) => {
    const response = await apiClient.post(
      `/application/${applicationReference}/submit`
    );
    return response.data;
  },

  getApplicationDocuments: async (applicationReference) => {
    const response = await apiClient.get(
      `/application/${applicationReference}/documents`
    );
    return response.data;
  },

  uploadApplicationDocuments: async (
    applicationReference,
    documentGroup,
    documentKeys,
    files
  ) => {
    const formData = new FormData();
    formData.append("document_group", documentGroup);

    documentKeys.forEach((key) => {
      formData.append("document_keys", key);
    });

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post(
      `/application/${applicationReference}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteApplicationDocument: async (applicationReference, documentId) => {
    const response = await apiClient.delete(
      `/application/${applicationReference}/documents/${documentId}`
    );
    return response.data;
  },
};

export default applicationApi;