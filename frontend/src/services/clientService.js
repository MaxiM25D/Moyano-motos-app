import api from "./api.js";

export const getClients = async (search = "") => {
  const response = await api.get("/clients", {
    params: search ? { search } : undefined
  });
  return response.data.data.clients;
};

export const createClient = async (client) => {
  const response = await api.post("/clients", client);
  return response.data.data.client;
};

export const updateClient = async (id, client) => {
  const response = await api.patch(`/clients/${id}`, client);
  return response.data.data.client;
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data.data.client;
};
