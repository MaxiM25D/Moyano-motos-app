import { OrderService } from "../services/order.service.js";
import { OrderDTO }     from "../dto/order.dto.js";
 
const orderService = new OrderService();

const handleOrderError = (res, error) => {
  res.status(error.status || 500).json({ error: error.message });
};
 
// Usuario crea una orden desde su carrito
export const createOrder = async (req, res) => {
  try {
    const userId  = req.user.sub;
    const { cartId, shipping } = req.body;
 
    if (!cartId || !shipping)
      return res.status(400).json({ message: "Faltan datos: cartId y shipping son requeridos" });
 
    const order = await orderService.createOrder(userId, cartId, shipping);
    res.status(201).json({ message: "Orden creada", order: new OrderDTO(order) });
  } catch (error) {
    handleOrderError(res, error);
  }
};
 
// Usuario ve sus órdenes
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.sub;
    const orders = await orderService.getOrdersByUserId(userId);
    res.json({ orders: orders.map((o) => new OrderDTO(o)) });
  } catch (error) {
    handleOrderError(res, error);
  }
};
 
// Usuario ve una orden específica
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    const orderUserId = order.user?._id?.toString() ?? order.user?.toString();
    const isOwner = orderUserId === req.user.sub;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "No tenes permiso para ver esta orden" });
    }

    res.json({ order: new OrderDTO(order) });
  } catch (error) {
    handleOrderError(res, error);
  }
};
 
// Admin ve todas las órdenes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ orders: orders.map((o) => new OrderDTO(o)) });
  } catch (error) {
    handleOrderError(res, error);
  }
};
 
// Admin cambia el estado de una orden
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Estado inválido" });
 
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ message: "Estado actualizado", order: new OrderDTO(order) });
  } catch (error) {
    handleOrderError(res, error);
  }
};
