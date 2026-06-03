import apiClient from "./client";

const loanApi = {
  // POST /loan/baseline
  calculateBaseline: async (payload) => {
    const response = await apiClient.post("/loan/baseline", payload);
    return response.data;
  },

  // POST /loan/loan
  createLoanAndCalculate: async (payload) => {
    const response = await apiClient.post("/loan/loan", payload);
    return response.data;
  },

  // GET /loan/{loan_reference}
  getLoanDetails: async (loanReference) => {
    const response = await apiClient.get(`/loan/${loanReference}`);
    return response.data;
  },

  // GET /loan/my-loans
  getMyLoans: async () => {
    const response = await apiClient.get("/loan/my-loans");
    return response.data;
  },
};

export default loanApi;