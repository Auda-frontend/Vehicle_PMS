/*
  Warnings:

  - Added the required column `entryTime` to the `SlotRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plateNumber` to the `SlotRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlotRequest" ADD COLUMN     "amountDue" DOUBLE PRECISION,
ADD COLUMN     "entryTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "exitTime" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "plateNumber" TEXT NOT NULL,
ADD COLUMN     "receiptSent" BOOLEAN NOT NULL DEFAULT false;

-- -- Step 1: Make the columns nullable first
-- ALTER TABLE "SlotRequest" ADD COLUMN "entryTime" TIMESTAMP(3);
-- ALTER TABLE "SlotRequest" ADD COLUMN "plateNumber" TEXT;

-- -- Step 2: Update existing records with default values
-- UPDATE "SlotRequest" SET 
--   "entryTime" = NOW(),
--   "plateNumber" = 'UNKNOWN'
-- WHERE "entryTime" IS NULL OR "plateNumber" IS NULL;

-- -- Step 3: Now make the columns required
-- ALTER TABLE "SlotRequest" ALTER COLUMN "entryTime" SET NOT NULL;
-- ALTER TABLE "SlotRequest" ALTER COLUMN "plateNumber" SET NOT NULL;
