import api from "./api.js";

export const getReceipts = async ({ search = "", page = 1, pageSize = 20 } = {}) => {
  const response = await api.get("/receipts", {
    params: { search: search || undefined, page, pageSize }
  });
  return response.data.data;
};

export const getPaymentsWithoutReceipt = async ({ search = "", page = 1, pageSize = 20 } = {}) => {
  const response = await api.get("/receipts/pending", {
    params: { search: search || undefined, page, pageSize }
  });
  return response.data.data;
};

export const createReceipt = async (paymentId) => {
  const response = await api.post(`/receipts/payment/${paymentId}`);
  return response.data.data.receipt;
};

export const markReceiptPrinted = async (id) => {
  const response = await api.patch(`/receipts/${id}/print`);
  return response.data.data.receipt;
};
