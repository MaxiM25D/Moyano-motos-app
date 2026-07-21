import Joi from "joi";

const money = Joi.number().precision(2).min(0);

export const createSaleSchema = Joi.object({
  clientId: Joi.number().integer().positive().required(),
  motorcycleId: Joi.number().integer().positive().required(),
  salePrice: money.required(),
  downPayment: money.required(),
  financingInterestRate: Joi.number().precision(2).min(0).max(100).default(0),
  installmentPlan: Joi.number().integer().min(1).max(60).required(),
  saleDate: Joi.date().optional(),
  firstDueDate: Joi.date().optional()
});
