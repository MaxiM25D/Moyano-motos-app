import { CartService } from "../services/cart.service.js";
import { CartDTO }     from "../dto/cart.dto.js";

const cartService = new CartService();

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart(req.user.sub);
    res.status(201).json({ message: "Carrito creado", cart: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    res.json({ cart: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.addProduct(cid, pid);
    res.json({ message: "Producto agregado al carrito", cart: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
