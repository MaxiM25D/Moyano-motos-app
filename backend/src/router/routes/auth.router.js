import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import env from "../../config/env.config.js";
import {registerUser, currentUser} from "../../controllers/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../../validators/auth.validator.js";


const router = Router();

router.post("/register", validate(registerSchema),registerUser);

// LOGIN con LocalStrategy
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {

    const payload = {
      sub: req.user._id,
      role: req.user.role
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "1h",
      issuer: "tu-app-api",
      audience: "tu-app-client"
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
      },
      token
    });
  },
validate(loginSchema));

// CURRENT con JwtStrategy
router.get("/current", passport.authenticate("jwt", { session: false }), currentUser);

export default router;