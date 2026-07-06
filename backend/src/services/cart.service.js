import { CartRepository }    from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { HttpError } from "../utils/httpError.js";

const cartRepository    = new CartRepository();
const productRepository = new ProductRepository();

export class CartService {
  async createCart(userId) {
  const existing = await cartRepository.getCartByUserId(userId);
  if (existing) return existing; // si ya tiene carrito, devolvé el existente
  return cartRepository.createCart(userId);
}

  async getCartById(id, userId) {
    const cart = await this.getOwnedCart(id, userId);
    return cart;
  }

  updateCart(id, data) {
    return cartRepository.updateCart(id, data);
  }

  async getOwnedCart(cartId, userId) {
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) throw new HttpError("Carrito no encontrado", 404);
    if (cart.user.toString() !== userId) {
      throw new HttpError("No tenes permiso para modificar este carrito", 403);
    }
    return cart;
  }

  async addProduct(cartId, productId, userId) {
    const cart = await this.getOwnedCart(cartId, userId);

    const product = await productRepository.getProductById(productId);
    if (!product) throw new HttpError("Producto no encontrado", 404);

    const existing = cart.products.find((p) => {
      const id = p.product._id ? p.product._id.toString() : p.product.toString();
      return id === productId;
    });

    if (existing && existing.quantity >= product.stock) {
      throw new HttpError(`Stock insuficiente para ${product.title}`, 400);
    }

    if (existing) {
      existing.quantity += 1;
    } else {
      if (product.stock < 1) {
        throw new HttpError(`Stock insuficiente para ${product.title}`, 400);
      }
      cart.products.push({ product: productId, quantity: 1 });
    }

    return cartRepository.saveCart(cart);
  }

  async updateProductQuantity(cartId, productId, quantity, userId) {
    const cart = await this.getOwnedCart(cartId, userId);
    const item = cart.products.find((entry) => {
      const id = entry.product._id ? entry.product._id.toString() : entry.product.toString();
      return id === productId;
    });

    if (!item) throw new HttpError("Producto no encontrado en el carrito", 404);
    if (item.product.stock < quantity) {
      throw new HttpError(`Stock insuficiente para ${item.product.title}`, 400);
    }

    item.quantity = quantity;
    return cartRepository.saveCart(cart);
  }

  async removeProduct(cartId, productId, userId) {
    const cart = await this.getOwnedCart(cartId, userId);
    const initialLength = cart.products.length;

    cart.products = cart.products.filter((entry) => {
      const id = entry.product._id ? entry.product._id.toString() : entry.product.toString();
      return id !== productId;
    });

    if (cart.products.length === initialLength) {
      throw new HttpError("Producto no encontrado en el carrito", 404);
    }

    return cartRepository.saveCart(cart);
  }
}
