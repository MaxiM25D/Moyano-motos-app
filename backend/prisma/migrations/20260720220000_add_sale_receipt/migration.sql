CREATE TABLE "SaleReceipt" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "printedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleReceipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SaleReceipt_saleId_key" ON "SaleReceipt"("saleId");
CREATE UNIQUE INDEX "SaleReceipt_receiptNumber_key" ON "SaleReceipt"("receiptNumber");

INSERT INTO "SaleReceipt" ("saleId", "receiptNumber", "createdAt")
SELECT
    "id",
    'VTA-' || EXTRACT(YEAR FROM "saleDate")::INTEGER || '-' || LPAD("saleNumber"::TEXT, 8, '0'),
    "createdAt"
FROM "Sale";

ALTER TABLE "SaleReceipt"
ADD CONSTRAINT "SaleReceipt_saleId_fkey"
FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
