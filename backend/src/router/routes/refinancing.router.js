import { Router } from "express";
import {
  createRefinancing,
  markRefinancingReceiptPrinted
} from "../../controllers/refinancing.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createRefinancingSchema } from "../../validators/refinancing.validator.js";

const router = Router();

router.post(
  "/sale/:saleId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validate(createRefinancingSchema),
  createRefinancing
);
router.patch(
  "/:id/receipt/printed",
  authMiddleware,
  roleMiddleware("ADMIN"),
  markRefinancingReceiptPrinted
);

export default router;
