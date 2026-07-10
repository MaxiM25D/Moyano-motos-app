import { Router } from "express";
import {
  createReceiptFromPayment,
  getReceiptById,
  getReceipts,
  printReceipt
} from "../../controllers/receipt.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", authMiddleware, getReceipts);
router.get("/:id", authMiddleware, getReceiptById);
router.post("/payment/:paymentId", authMiddleware, roleMiddleware("ADMIN", "COLLECTOR"), createReceiptFromPayment);
router.patch("/:id/print", authMiddleware, roleMiddleware("ADMIN", "COLLECTOR"), printReceipt);

export default router;
