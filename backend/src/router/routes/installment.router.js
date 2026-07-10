import { Router } from "express";
import {
  getInstallments,
  getInstallmentsBySaleId,
  getOverdueInstallments,
  getPendingInstallments,
  payInstallment
} from "../../controllers/installment.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { payInstallmentSchema } from "../../validators/installment.validator.js";

const router = Router();

router.get("/", authMiddleware, getInstallments);
router.get("/pending", authMiddleware, getPendingInstallments);
router.get("/overdue", authMiddleware, getOverdueInstallments);
router.get("/sale/:saleId", authMiddleware, getInstallmentsBySaleId);
router.patch(
  "/:id/pay",
  authMiddleware,
  roleMiddleware("ADMIN", "COLLECTOR"),
  validate(payInstallmentSchema),
  payInstallment
);

export default router;
