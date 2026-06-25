import { OrderDAO } from "../dao/order.dao.js";

const orderDAO = new OrderDAO();

export class OrderRepository {
  createOrder(data) {
    return orderDAO.create(data);
  }

  getOrderById(id) {
    return orderDAO.getById(id);
  }

  getOrdersByUserId(userId) {
    return orderDAO.getByUserId(userId);
  }

  getAllOrders() {
    return orderDAO.getAll();
  }

  updateOrderStatus(id, status) {
    return orderDAO.updateStatus(id, status);
  }

  updateOrderPayment(id, payment_id, status) {
    return orderDAO.updatePayment(id, payment_id, status);
  }
}
