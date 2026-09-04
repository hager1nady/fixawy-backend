/*
  Warnings:

  - A unique constraint covering the columns `[mobileNumber]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_mobileNumber_key" ON "Client"("mobileNumber");
