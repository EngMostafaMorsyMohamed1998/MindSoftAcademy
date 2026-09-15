-- CreateTable
CREATE TABLE "ClassWeekPlan" (
    "id" TEXT NOT NULL,
    "slots" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassWeekPlan_pkey" PRIMARY KEY ("id")
);
