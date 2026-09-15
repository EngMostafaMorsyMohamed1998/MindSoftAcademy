-- CreateTable
CREATE TABLE "ClassPayment" (
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassPayment_pkey" PRIMARY KEY ("studentId","month")
);
