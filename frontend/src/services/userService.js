import api from "./api.js";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data.data.users;
};

export const createUser = async (user) => {
  const response = await api.post("/users", user);
  return response.data.data.user;
};

export const updateUser = async (id, user) => {
  const response = await api.patch(`/users/${id}`, user);
  return response.data.data.user;
};
