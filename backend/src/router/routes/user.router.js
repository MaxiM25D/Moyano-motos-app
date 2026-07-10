import { Router } from "express";
import {
  createFirstAdmin,
  createUser,
  getUserById,
  getUsers,
  updateUser
} from "../../controllers/user.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import {
  createUserSchema,
  updateUserSchema
} from "../../validators/user.validator.js";

const router = Router();

router.post("/bootstrap-admin", validate(createUserSchema), createFirstAdmin);
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getUsers);
router.get("/:id", authMiddleware, roleMiddleware("ADMIN"), getUserById);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), validate(createUserSchema), createUser);
router.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), validate(updateUserSchema), updateUser);

export default router;
