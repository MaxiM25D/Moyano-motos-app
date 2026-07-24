import api from "./api.js";

export const getDashboardData = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data.data.report;
};
