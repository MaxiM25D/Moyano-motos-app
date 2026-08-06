import assert from "node:assert/strict";
import test from "node:test";
import { payInstallmentSchema } from "../src/validators/installment.validator.js";
import { createRefinancingSchema } from "../src/validators/refinancing.validator.js";
import { createSaleSchema } from "../src/validators/sale.validator.js";

test("accepts interest rates greater than 100 percent", () => {
  const sale = createSaleSchema.validate({
    clientId: 1,
    motorcycleId: 1,
    salePrice: 1000000,
    downPayment: 100000,
    financingInterestRate: 250,
    installmentPlan: 12
  });
  const payment = payInstallmentSchema.validate({ interestRate: 250 });
  const refinancing = createRefinancingSchema.validate({
    startInstallmentId: 1,
    interestRate: 250,
    installmentCount: 12,
    firstDueDate: "2026-09-10"
  });

  assert.equal(sale.error, undefined);
  assert.equal(payment.error, undefined);
  assert.equal(refinancing.error, undefined);
});
