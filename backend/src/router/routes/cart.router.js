import { Router } from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart
} from "../../controllers/cart.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateCartQuantitySchema } from "../../validators/cart.validator.js";

const router = Router();

router.post("/",                  authMiddleware, createCart);
router.get("/:cid",               authMiddleware, getCartById);
router.post("/:cid/product/:pid", authMiddleware, addProductToCart);
router.put("/:cid/product/:pid", authMiddleware, validate(updateCartQuantitySchema), updateProductQuantity);
router.delete("/:cid/product/:pid", authMiddleware, removeProductFromCart);

export default router;

