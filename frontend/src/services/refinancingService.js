import api from "./api.js";

export const createRefinancing = async (saleId, refinancing) => {
  const response = await api.post(`/refinancings/sale/${saleId}`, refinancing);
  return response.data.data;
};

export const markRefinancingReceiptPrinted = async (id) => {
  const response = await api.patch(`/refinancings/${id}/receipt/printed`);
  return response.data.data.refinancing;
};
