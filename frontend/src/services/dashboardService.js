import api from "./api.js";

export const getDashboardData = async () => {
  const [salesResponse, pendingResponse, overdueResponse] = await Promise.all([
    api.get("/sales"),
    api.get("/installments/pending"),
    api.get("/installments/overdue")
  ]);

  return {
    sales: salesResponse.data.data.sales,
    pending: pendingResponse.data.data.installments,
    overdue: overdueResponse.data.data.installments
  };
};
