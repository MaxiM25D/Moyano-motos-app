import { Router } from "express";
import { current, login, logout, refresh } from "../../controllers/auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema } from "../../validators/auth.validator.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/current", authMiddleware, current);

export default router;
