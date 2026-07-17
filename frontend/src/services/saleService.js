import api from "./api.js";

export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data.data.sales;
};

export const createSale = async (sale) => {
  const response = await api.post("/sales", sale);
  return response.data.data.sale;
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data.data.sale;
};
