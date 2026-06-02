import { Router } from "express";
import passport from "passport";
import {
  createCart,
  getMyCart,
  getCartById,
  addProductToCart,
  mergeGuestCart,
  checkoutCart
} from "../../controllers/cart.controller.js";
import { authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addProductToCartSchema } from "../../validators/cart.validator.js";

const router = Router();

// 🔐 Todo requiere autenticación
router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createCart);
router.get("/", getMyCart);
router.get("/:id", authorize("admin"), getCartById);
router.post("/products/:pid", validate(addProductToCartSchema), addProductToCart);
router.post("/merge", mergeGuestCart);
router.post("/checkout", checkoutCart);

export default router;