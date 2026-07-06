import { OrderRepository } from "../repositories/order.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { HttpError } from "../utils/httpError.js";

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

export class OrderService {
  async createOrder(userId, cartId, shipping) {
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) throw new HttpError("Carrito no encontrado", 404);

    if (cart.user.toString() !== userId) {
      throw new HttpError("No tenes permiso para comprar este carrito", 403);
    }

    if (!cart.products.length) {
      throw new HttpError("El carrito esta vacio", 400);
    }

    const items = [];
    let total = 0;

    for (const item of cart.products) {
      const product = item.product;

      if (!product) throw new HttpError("Producto no encontrado en el carrito", 404);
      if (product.stock < item.quantity) {
        throw new HttpError(`Stock insuficiente para ${product.title}`, 400);
      }

      items.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity
      });

      total += product.price * item.quantity;
    }

    const order = await orderRepository.createOrder({
      user: userId,
      items,
      shipping,
      total
    });

    for (const item of cart.products) {
      const product = item.product;
      product.stock -= item.quantity;
      await productRepository.updateProduct(product._id, { stock: product.stock });
    }

    cart.products = [];
    await cartRepository.saveCart(cart);

    return order;
  }

  getOrderById(id) {
    return orderRepository.getOrderById(id);
  }

  getOrdersByUserId(userId) {
    return orderRepository.getOrdersByUserId(userId);
  }

  getAllOrders() {
    return orderRepository.getAllOrders();
  }

  updateOrderStatus(id, status) {
    return orderRepository.updateOrderStatus(id, status);
  }

  updateOrderPayment(id, payment_id, status) {
    return orderRepository.updateOrderPayment(id, payment_id, status);
  }
}
