import api from "./api.js";

export const getSales = async ({ search = "", page = 1, pageSize = 20 } = {}) => {
  const response = await api.get("/sales", {
    params: { search: search || undefined, page, pageSize }
  });
  return response.data.data;
};

export const getSaleById = async (id) => {
  const response = await api.get(`/sales/${id}`);
  return response.data.data.sale;
};

export const createSale = async (sale) => {
  const response = await api.post("/sales", sale);
  return response.data.data.sale;
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data.data.sale;
};

export const markSaleReceiptPrinted = async (id) => {
  const response = await api.patch(`/sales/${id}/receipt/printed`);
  return response.data.data.receipt;
};
