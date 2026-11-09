ALTER TABLE "Order"
ADD COLUMN "orderCode" TEXT;

UPDATE "Order"
SET "orderCode" = 'ORD-' || UPPER(SUBSTRING(REPLACE("id", '-', '') FROM 1 FOR 8))
WHERE "orderCode" IS NULL;

ALTER TABLE "Order"
ALTER COLUMN "orderCode" SET NOT NULL;

CREATE UNIQUE INDEX "Order_orderCode_key"
ON "Order"("orderCode");