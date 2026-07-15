import api from "./api.js";

export const getReceipts = async () => {
  const response = await api.get("/receipts");
  return response.data.data.receipts;
};

export const createReceipt = async (paymentId) => {
  const response = await api.post(`/receipts/payment/${paymentId}`);
  return response.data.data.receipt;
};

export const markReceiptPrinted = async (id) => {
  const response = await api.patch(`/receipts/${id}/print`);
  return response.data.data.receipt;
};
