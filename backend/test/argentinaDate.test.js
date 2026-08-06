import assert from "node:assert/strict";
import test from "node:test";
import { getCurrentArgentinaMonthRange } from "../src/utils/argentinaDate.js";

test("builds the current month from the Argentina calendar date", () => {
  const range = getCurrentArgentinaMonthRange(new Date("2026-09-01T01:30:00.000Z"));

  assert.equal(range.from.toISOString(), "2026-08-01T00:00:00.000Z");
  assert.equal(range.to.toISOString(), "2026-09-01T00:00:00.000Z");
  assert.equal(range.today.toISOString(), "2026-08-31T00:00:00.000Z");
});
