import { CartDAO } from "../dao/cart.dao.js";

const cartDAO = new CartDAO();

export class CartRepository {
  createCart(userId) {
  return cartDAO.create(userId);
  }

  getCartById(id) {
    return cartDAO.getById(id);
  }
  getCartByUserId(userId) {
  return cartDAO.getByUserId(userId);
}

  updateCart(id, data) {
    return cartDAO.update(id, data);
  }

  saveCart(cart) {
    return cartDAO.save(cart);
  }
}
