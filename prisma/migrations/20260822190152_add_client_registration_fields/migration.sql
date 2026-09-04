/*
  Warnings:

  - Added the required column `nationalId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalIdImage` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Client_email_key";

-- DropIndex
DROP INDEX "Client_mobileNumber_key";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "nationalId" TEXT NOT NULL,
ADD COLUMN     "nationalIdImage" TEXT NOT NULL,
ALTER COLUMN "currentLocation" DROP NOT NULL,
ALTER COLUMN "preferredLanguage" DROP NOT NULL,
ALTER COLUMN "preferredPaymentMethod" DROP NOT NULL;
