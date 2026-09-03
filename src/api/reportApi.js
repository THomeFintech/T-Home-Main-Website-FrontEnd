import apiClient from "./client";

const reportApi = {
  getFinalReport: async (loanReference) => {
    const response = await apiClient.get(`/loan/${loanReference}/report`);
    return response.data;
  },

  getRecommendationHistory: async (loanReference) => {
    const response = await apiClient.get(`/loan/${loanReference}/recommendation-history`);
    return response.data;
  },
};

export default reportApi;