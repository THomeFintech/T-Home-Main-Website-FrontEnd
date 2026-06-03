import apiClient from "./client";

const offersApi = {
  // GET /loan/{loan_reference}/offers
  getOffers: async (loanReference) => {
    const response = await apiClient.get(`/loan/${loanReference}/offers`);
    return response.data;
  },

  // POST /loan/{loan_reference}/offers
  submitOffers: async (loanReference, payload) => {
    const response = await apiClient.post(
      `/loan/${loanReference}/offers`,
      payload
    );
    return response.data;
  },

  // PUT /loan/{loan_reference}/offers/{offer_id}
  updateOffer: async (loanReference, offerId, payload) => {
    const response = await apiClient.put(
      `/loan/${loanReference}/offers/${offerId}`,
      payload
    );
    return response.data;
  },

  // DELETE /loan/{loan_reference}/offers/{offer_id}
  deleteOffer: async (loanReference, offerId) => {
    const response = await apiClient.delete(
      `/loan/${loanReference}/offers/${offerId}`
    );
    return response.data;
  },
};

export default offersApi;