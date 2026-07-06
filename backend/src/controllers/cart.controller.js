import { CartService } from "../services/cart.service.js";
import { CartDTO }     from "../dto/cart.dto.js";

const cartService = new CartService();

const handleCartError = (res, error) => {
  res.status(error.status || 500).json({ error: error.message });
};

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
    const cart = await cartService.getCartById(req.params.cid, req.user.sub);
    res.json({ cart: new CartDTO(cart) });
  } catch (error) {
    handleCartError(res, error);
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.addProduct(cid, pid, req.user.sub);
    res.json({ message: "Producto agregado al carrito", cart: new CartDTO(cart) });
  } catch (error) {
    handleCartError(res, error);
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.updateProductQuantity(
      cid,
      pid,
      req.body.quantity,
      req.user.sub
    );
    res.json({ message: "Cantidad actualizada", cart: new CartDTO(cart) });
  } catch (error) {
    handleCartError(res, error);
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.removeProduct(cid, pid, req.user.sub);
    res.json({ message: "Producto eliminado del carrito", cart: new CartDTO(cart) });
  } catch (error) {
    handleCartError(res, error);
  }
};
