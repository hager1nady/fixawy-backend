/*
  Warnings:

  - You are about to drop the column `phone` on the `Technician` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobileNumber]` on the table `Technician` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobileNumber` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Technician_phone_key";

-- AlterTable
ALTER TABLE "Technician" DROP COLUMN "phone",
ADD COLUMN     "mobileNumber" TEXT NOT NULL,
ALTER COLUMN "currentLocation" DROP NOT NULL,
ALTER COLUMN "commissionPercentage" SET DEFAULT 0,
ALTER COLUMN "averageRating" SET DEFAULT 0,
ALTER COLUMN "completedOrdersCount" SET DEFAULT 0,
ALTER COLUMN "cancelledOrdersCount" SET DEFAULT 0,
ALTER COLUMN "accountStatus" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Technician_mobileNumber_key" ON "Technician"("mobileNumber");
