import { Router } from "express";
import {
  createClient,
  getClientById,
  getClients,
  updateClient
} from "../../controllers/client.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import {
  createClientSchema,
  updateClientSchema
} from "../../validators/client.validator.js";

const router = Router();

router.get("/", authMiddleware, getClients);
router.get("/:id", authMiddleware, getClientById);
router.post("/", authMiddleware, roleMiddleware("ADMIN", "SELLER"), validate(createClientSchema), createClient);
router.patch("/:id", authMiddleware, roleMiddleware("ADMIN", "SELLER"), validate(updateClientSchema), updateClient);

export default router;
