import { Router } from "express";
import {
  getCollectionsReport,
  getDebtReport,
  getOverdueReport,
  getSalesReport
} from "../../controllers/report.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/collections", authMiddleware, roleMiddleware("ADMIN", "COLLECTOR"), getCollectionsReport);
router.get("/installments/overdue", authMiddleware, roleMiddleware("ADMIN", "COLLECTOR"), getOverdueReport);
router.get("/debt", authMiddleware, roleMiddleware("ADMIN"), getDebtReport);
router.get("/sales", authMiddleware, roleMiddleware("ADMIN"), getSalesReport);

export default router;
