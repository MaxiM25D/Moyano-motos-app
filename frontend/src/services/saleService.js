import api from "./api.js";

export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data.data.sales;
};

export const createSale = async (sale) => {
  const response = await api.post("/sales", sale);
  return response.data.data.sale;
};
