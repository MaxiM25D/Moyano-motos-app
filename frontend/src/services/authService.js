import api, { renewSession } from "./api.js";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/current");
  return response.data.data;
};

export const refreshSession = () => renewSession();

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
