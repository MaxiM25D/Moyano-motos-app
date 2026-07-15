import api from "./api.js";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/current");
  return response.data.data;
};
