-- CreateTable
CREATE TABLE IF NOT EXISTS "ClassSubscriptionRequest" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "wallet" TEXT NOT NULL,
    "senderPhone" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT,
    "proofMime" TEXT NOT NULL,
    "proofData" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TEXT NOT NULL,
    "reviewedAt" TEXT,

    CONSTRAINT "ClassSubscriptionRequest_pkey" PRIMARY KEY ("id")
);
