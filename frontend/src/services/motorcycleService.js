import api from "./api.js";

export const getMotorcycles = async ({ search = "", page = 1, pageSize = 20, available = false } = {}) => {
  const response = await api.get("/motorcycles", {
    params: { search: search || undefined, page, pageSize, available: available || undefined }
  });
  return response.data.data;
};

export const createMotorcycle = async (motorcycle) => {
  const response = await api.post("/motorcycles", motorcycle);
  return response.data.data.motorcycle;
};

export const updateMotorcycle = async (id, motorcycle) => {
  const response = await api.patch(`/motorcycles/${id}`, motorcycle);
  return response.data.data.motorcycle;
};

export const deleteMotorcycle = async (id) => {
  const response = await api.delete(`/motorcycles/${id}`);
  return response.data.data.motorcycle;
};
