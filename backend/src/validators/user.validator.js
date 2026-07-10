import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid("ADMIN", "SELLER", "COLLECTOR").default("SELLER")
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().min(6).max(100).optional(),
  role: Joi.string().valid("ADMIN", "SELLER", "COLLECTOR").optional(),
  active: Joi.boolean().optional()
}).min(1);
