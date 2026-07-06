import api from "./api";

export const createCart = async () => {
  const response = await api.post("/carts");
  return response.data;
};

export const getCart = async (cartId) => {
  const response = await api.get(`/carts/${cartId}`);
  return response.data;
};

export const addProductToCart = async (cartId, productId) => {
  const response = await api.post(`/carts/${cartId}/product/${productId}`);
  return response.data;
};

export const updateProductQuantity = async (cartId, productId, quantity) => {
  const response = await api.put(`/carts/${cartId}/product/${productId}`, { quantity });
  return response.data;
};

export const removeProductFromCart = async (cartId, productId) => {
  const response = await api.delete(`/carts/${cartId}/product/${productId}`);
  return response.data;
};
