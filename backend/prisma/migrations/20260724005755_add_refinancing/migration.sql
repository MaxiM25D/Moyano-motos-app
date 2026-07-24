-- AlterTable
ALTER TABLE "SaleReceipt" ADD COLUMN     "planSnapshot" JSONB;

-- CreateTable
CREATE TABLE "Refinancing" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "startInstallmentNumber" INTEGER NOT NULL,
    "previousBalance" DECIMAL(12,2) NOT NULL,
    "interestRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "interestAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "installmentCount" INTEGER NOT NULL,
    "installmentAmount" DECIMAL(12,2) NOT NULL,
    "firstDueDate" TIMESTAMP(3) NOT NULL,
    "previousPlan" JSONB NOT NULL,
    "newPlan" JSONB NOT NULL,
    "notes" TEXT,
    "receiptNumber" TEXT NOT NULL,
    "printedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refinancing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Refinancing_receiptNumber_key" ON "Refinancing"("receiptNumber");

-- CreateIndex
CREATE INDEX "Refinancing_saleId_idx" ON "Refinancing"("saleId");

-- CreateIndex
CREATE INDEX "Refinancing_createdById_idx" ON "Refinancing"("createdById");

-- CreateIndex
CREATE INDEX "Refinancing_createdAt_idx" ON "Refinancing"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Refinancing_saleId_sequence_key" ON "Refinancing"("saleId", "sequence");

-- AddForeignKey
ALTER TABLE "Refinancing" ADD CONSTRAINT "Refinancing_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refinancing" ADD CONSTRAINT "Refinancing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
