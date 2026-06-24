import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/product.controller.js";
import { authMiddleware } from "../../middlewares//auth.middleware.js";
import { roleMiddleware }  from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/",       getProducts);
router.get("/:id",    getProductById);
router.post("/",      authMiddleware, roleMiddleware("admin"), createProduct);
router.put("/:id",    authMiddleware, roleMiddleware("admin"), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default router;
