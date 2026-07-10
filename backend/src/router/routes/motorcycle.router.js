import { Router } from "express";
import {
  createMotorcycle,
  getMotorcycleById,
  getMotorcycles,
  updateMotorcycle
} from "../../controllers/motorcycle.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import {
  createMotorcycleSchema,
  updateMotorcycleSchema
} from "../../validators/motorcycle.validator.js";

const router = Router();

router.get("/", authMiddleware, getMotorcycles);
router.get("/:id", authMiddleware, getMotorcycleById);
router.post("/", authMiddleware, roleMiddleware("ADMIN", "SELLER"), validate(createMotorcycleSchema), createMotorcycle);
router.patch("/:id", authMiddleware, roleMiddleware("ADMIN", "SELLER"), validate(updateMotorcycleSchema), updateMotorcycle);

export default router;
