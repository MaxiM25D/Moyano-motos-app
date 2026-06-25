import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../../controllers/order.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware }  from "../../middlewares/role.middleware.js";
 
const router = Router();
 
// Usuario
router.post("/",        authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id",      authMiddleware, getOrderById);
 
// Admin
router.get("/",             authMiddleware, roleMiddleware("admin"), getAllOrders);
router.put("/:id/status",   authMiddleware, roleMiddleware("admin"), updateOrderStatus);
 
export default router;
