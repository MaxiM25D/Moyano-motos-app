import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { sendContactMessage } from "../../controllers/contact.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { contactSchema } from "../../validators/contact.validator.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Demasiados mensajes. Intenta nuevamente en unos minutos." }
});

router.post("/", contactLimiter, validate(contactSchema), sendContactMessage);

export default router;
