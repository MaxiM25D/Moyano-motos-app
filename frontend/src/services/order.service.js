import api from "./api";

// ======================
// Cliente
// ======================

/*Crear una nueva orden*/
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

/* Obtener las órdenes del usuario autenticado*/
export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

/*Obtener una orden por ID*/
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// ======================
// Admin
// ======================
/* Obtener todas las órdenes*/
export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

/* Actualizar estado de una orden*/
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, {
    status,
  });

  return response.data;
};