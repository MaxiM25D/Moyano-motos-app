import { Cart } from "../models/cart.model.js";

export class CartDAO {
  create(userId) {
  return Cart.create({ user: userId, products: [] });
}

  getById(id) {
    return Cart.findById(id).populate("products.product");
  }
  getByUserId(userId) {
  return Cart.findOne({ user: userId });
}

  update(id, data) {
    return Cart.findByIdAndUpdate(id, data, { new: true });
  }

  save(cart) {
    return cart.save();
  }
}
