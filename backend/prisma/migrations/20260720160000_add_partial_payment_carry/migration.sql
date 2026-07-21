CREATE TYPE "BalanceAllocation" AS ENUM ('NEXT_INSTALLMENT', 'REMAINING_INSTALLMENTS');

ALTER TABLE "Payment"
ADD COLUMN "expectedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "carriedBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "balanceAllocation" "BalanceAllocation";

UPDATE "Payment"
SET "expectedAmount" = "amount";
