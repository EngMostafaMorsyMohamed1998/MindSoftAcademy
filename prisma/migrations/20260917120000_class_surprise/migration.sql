-- CreateTable
CREATE TABLE "ClassSurprise" (
    "id" TEXT NOT NULL,
    "payload" TEXT NOT NULL,

    CONSTRAINT "ClassSurprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSurpriseAnswer" (
    "id" TEXT NOT NULL,
    "surpriseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "choice" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSurpriseAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassSurpriseAnswer_surpriseId_studentId_key" ON "ClassSurpriseAnswer"("surpriseId", "studentId");

-- CreateIndex
CREATE INDEX "ClassSurpriseAnswer_surpriseId_idx" ON "ClassSurpriseAnswer"("surpriseId");
