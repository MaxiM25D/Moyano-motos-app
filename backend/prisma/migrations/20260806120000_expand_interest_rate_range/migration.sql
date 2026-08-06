-- AlterTable
ALTER TABLE "Sale"
ALTER COLUMN "financingInterestRate" TYPE DECIMAL(7,2);

-- AlterTable
ALTER TABLE "Refinancing"
ALTER COLUMN "interestRate" TYPE DECIMAL(7,2);

-- AlterTable
ALTER TABLE "Payment"
ALTER COLUMN "interestRate" TYPE DECIMAL(7,2);
