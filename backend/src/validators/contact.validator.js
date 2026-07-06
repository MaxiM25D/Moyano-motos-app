import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().max(120).required(),
  phone: Joi.string().trim().max(30).allow("").optional(),
  subject: Joi.string().trim().min(3).max(120).required(),
  message: Joi.string().trim().min(10).max(3000).required()
});
