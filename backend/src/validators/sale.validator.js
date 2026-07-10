import Joi from "joi";

const money = Joi.number().precision(2).min(0);

export const createSaleSchema = Joi.object({
  clientId: Joi.number().integer().positive().required(),
  motorcycleId: Joi.number().integer().positive().required(),
  salePrice: money.required(),
  downPayment: money.required(),
  installmentPlan: Joi.number().integer().valid(12, 15, 18, 24, 36).required(),
  saleDate: Joi.date().optional(),
  firstDueDate: Joi.date().optional()
});
