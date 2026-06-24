import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} from "../../controllers/session.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login",    loginUser);
router.post("/logout",   authMiddleware, logoutUser);
router.get("/current",   authMiddleware, currentUser);

export default router;
