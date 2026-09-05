import apiClient from "./client";

const recommendationApi = {
  // GET /loan/{loan_reference}/top3
  getTop3Recommendations: async (loanReference) => {
    const response = await apiClient.get(`/loan/${loanReference}/top3`);
    return response.data;
  },

  // GET /loan/{loan_reference}/report
  getFinalReport: async (loanReference) => {
    const response = await apiClient.get(`/loan/${loanReference}/report`);
    return response.data;
  },

  // GET /loan/{loan_reference}/recommendation-history
  getRecommendationHistory: async (loanReference) => {
    const response = await apiClient.get(
      `/loan/${loanReference}/recommendation-history`
    );
    return response.data;
  },
};

export default recommendationApi;