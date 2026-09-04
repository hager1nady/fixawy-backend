-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "currentLocation" TEXT NOT NULL,
    "preferredLanguage" TEXT NOT NULL,
    "preferredPaymentMethod" TEXT NOT NULL,
    "accountStatus" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "idCardImage" TEXT,
    "licenseRegistrationImage" TEXT,
    "profession" TEXT NOT NULL,
    "specialty" TEXT,
    "yearsOfExperience" INTEGER NOT NULL,
    "workArea" TEXT NOT NULL,
    "currentLocation" TEXT NOT NULL,
    "workingHours" TEXT NOT NULL,
    "holidays" TEXT,
    "transportation" TEXT,
    "bankAccount" TEXT,
    "eWallet" TEXT,
    "commissionPercentage" DOUBLE PRECISION NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "completedOrdersCount" INTEGER NOT NULL,
    "cancelledOrdersCount" INTEGER NOT NULL,
    "accountStatus" TEXT NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogService" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "serviceDescription" TEXT NOT NULL,
    "illustrativeImage" TEXT,
    "initialPrice" DOUBLE PRECISION,
    "pricingMethod" TEXT,
    "expectedDuration" INTEGER,

    CONSTRAINT "CatalogService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "problemImage" TEXT,
    "problemVideo" TEXT,
    "serviceLocation" TEXT NOT NULL,
    "acceptanceTime" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "completionTime" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "cancellationReason" TEXT,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "images" TEXT,
    "ratingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raterType" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "ratedType" TEXT NOT NULL,
    "ratedId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "serviceValue" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION,
    "technicianEarnings" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceNumber" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "complainantType" TEXT NOT NULL,
    "complainantId" TEXT NOT NULL,
    "againstType" TEXT NOT NULL,
    "againstId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "attachments" TEXT,
    "responsibleReviewEmployeeId" TEXT,
    "complaintStatus" TEXT NOT NULL,
    "finalDecision" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_mobileNumber_key" ON "Client"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Technician_phone_key" ON "Technician"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Technician_email_key" ON "Technician"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_orderId_technicianId_key" ON "Assignment"("orderId", "technicianId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "CatalogService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
