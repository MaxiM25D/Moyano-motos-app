import api from "./api.js";

export const getCollectionsReport = async (range) => {
  const response = await api.get("/reports/collections", { params: range });
  return response.data.data.report;
};

export const getOverdueReport = async () => {
  const response = await api.get("/reports/installments/overdue");
  return response.data.data.installments;
};

export const getDebtReport = async () => {
  const response = await api.get("/reports/debt");
  return response.data.data.report;
};

export const getSalesReport = async (range) => {
  const response = await api.get("/reports/sales", { params: range });
  return response.data.data.report;
};
