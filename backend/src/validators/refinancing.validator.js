import Joi from "joi";

export const createRefinancingSchema = Joi.object({
  startInstallmentId: Joi.number().integer().positive().required(),
  interestRate: Joi.number().precision(2).min(0).max(100).default(0),
  installmentCount: Joi.number().integer().min(1).max(60).required(),
  firstDueDate: Joi.date().required(),
  notes: Joi.string().trim().max(500).allow("").optional()
});
