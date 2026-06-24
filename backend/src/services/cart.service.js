import { CartRepository }    from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";

const cartRepository    = new CartRepository();
const productRepository = new ProductRepository();

export class CartService {
  async createCart(userId) {
  const existing = await cartRepository.getCartByUserId(userId);
  if (existing) return existing; // si ya tiene carrito, devolvé el existente
  return cartRepository.createCart(userId);
}

  getCartById(id) {
    return cartRepository.getCartById(id);
  }

  updateCart(id, data) {
    return cartRepository.updateCart(id, data);
  }

  async addProduct(cartId, productId) {
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await productRepository.getProductById(productId);
    if (!product) throw new Error("Producto no encontrado");

    const existing = cart.products.find((p) => {
      const id = p.product._id ? p.product._id.toString() : p.product.toString();
      return id === productId;
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return cartRepository.saveCart(cart);
  }
}
