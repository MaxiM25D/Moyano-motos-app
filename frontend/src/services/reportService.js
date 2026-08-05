import api from "./api.js";

export const getCollectionsReport = async (range, page = 1) => {
  const response = await api.get("/reports/collections", { params: { ...range, page, pageSize: 20 } });
  return response.data.data.report;
};

export const getOverdueReport = async (page = 1) => {
  const response = await api.get("/reports/installments/overdue", { params: { page, pageSize: 20 } });
  return response.data.data.report;
};

export const getDebtReport = async () => {
  const response = await api.get("/reports/debt");
  return response.data.data.report;
};

export const getSalesReport = async (range) => {
  const response = await api.get("/reports/sales", { params: range });
  return response.data.data.report;
};
