import assert from "node:assert/strict";
import test from "node:test";
import { distributeCents } from "../src/utils/paymentAdjustments.js";

test("distribuye todos los centavos sin perder saldo", () => {
  const distribution = distributeCents(10001, 3);

  assert.deepEqual(distribution, [3333, 3333, 3335]);
  assert.equal(distribution.reduce((total, amount) => total + amount, 0), 10001);
});

test("asigna todo el saldo cuando se traslada a la proxima cuota", () => {
  assert.deepEqual(distributeCents(25750, 1), [25750]);
});

test("rechaza una distribucion sin cuotas de destino", () => {
  assert.throws(() => distributeCents(1000, 0), RangeError);
});
