import Joi from "joi";

export const updateInstallmentSchema = Joi.object({
  amount: Joi.number().precision(2).positive().optional(),
  dueDate: Joi.date().optional()
}).min(1);

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
