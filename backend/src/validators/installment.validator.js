import Joi from "joi";

export const createInstallmentSchema = Joi.object({
  amount: Joi.number().precision(2).positive().required(),
  dueDate: Joi.date().required()
});

export const updateInstallmentSchema = Joi.object({
  dueDate: Joi.date().required()
});

export const updateInstallmentPlanSchema = Joi.object({
  amount: Joi.number().precision(2).positive().required(),
  dueDate: Joi.date().required()
});

export const payInstallmentSchema = Joi.object({
  amount: Joi.number().precision(2).positive().optional(),
  balanceAllocation: Joi.string()
    .valid("NEXT_INSTALLMENT", "REMAINING_INSTALLMENTS")
    .optional(),
  interestRate: Joi.number().precision(2).min(0).max(100).default(0),
  method: Joi.string().valid("CASH", "TRANSFER", "CARD", "OTHER").default("CASH"),
  paidAt: Joi.date().optional(),
  notes: Joi.string().trim().max(500).allow("").optional()
});
