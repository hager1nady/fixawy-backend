-- CreateTable
CREATE TABLE "CallRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callerType" TEXT NOT NULL,
    "callerId" TEXT,
    "receiverType" TEXT NOT NULL,
    "receiverId" TEXT,
    "department" TEXT,
    "callType" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "recordingUrl" TEXT,
    "notes" TEXT,
    "orderId" TEXT,

    CONSTRAINT "CallRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
