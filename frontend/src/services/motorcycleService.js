import api from "./api.js";

export const getMotorcycles = async (search = "") => {
  const response = await api.get("/motorcycles", {
    params: search ? { search } : undefined
  });
  return response.data.data.motorcycles;
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
