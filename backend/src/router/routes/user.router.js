import { Router } from "express";
import { getUsers, getUserById } from "../../controllers/user.controller.js";
import passport from "passport";
import { authorize } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));
router.use(authorize("admin"));

router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;