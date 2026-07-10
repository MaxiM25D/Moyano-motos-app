import { Router } from "express";
import { current, login } from "../../controllers/auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema } from "../../validators/auth.validator.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/current", authMiddleware, current);

export default router;
