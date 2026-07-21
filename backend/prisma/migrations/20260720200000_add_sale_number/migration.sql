ALTER TABLE "Sale"
ADD COLUMN "saleNumber" INTEGER;

WITH numbered_sales AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, "id" ASC)::INTEGER AS "number"
  FROM "Sale"
)
UPDATE "Sale"
SET "saleNumber" = numbered_sales."number"
FROM numbered_sales
WHERE "Sale"."id" = numbered_sales."id";

ALTER TABLE "Sale"
ALTER COLUMN "saleNumber" SET NOT NULL;

CREATE UNIQUE INDEX "Sale_saleNumber_key" ON "Sale"("saleNumber");
