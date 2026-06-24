import { Router } from "express";
import { getUsers, getUserById } from "../../controllers/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware }  from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/",    authMiddleware, roleMiddleware("admin"), getUsers);
router.get("/:id", authMiddleware, getUserById);

export default router;