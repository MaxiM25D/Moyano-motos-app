import { Router } from "express";
import {
  createSale,
  deleteSale,
  getSaleById,
  getSales
} from "../../controllers/sale.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { createSaleSchema } from "../../validators/sale.validator.js";

const router = Router();

router.get("/", authMiddleware, getSales);
router.get("/:id", authMiddleware, getSaleById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SELLER"),
  validate(createSaleSchema),
  createSale
);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteSale);

export default router;
