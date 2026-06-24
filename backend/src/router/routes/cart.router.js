import { Router } from "express";
import { createCart, getCartById, addProductToCart } from "../../controllers/cart.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/",                  authMiddleware, createCart);
router.get("/:cid",               authMiddleware, getCartById);
router.post("/:cid/product/:pid", authMiddleware, addProductToCart);

export default router;
