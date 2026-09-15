-- CreateTable
CREATE TABLE "ClassCertificate" (
    "serial" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "average" INTEGER NOT NULL,
    "verifyCode" TEXT NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "ClassCertificate_pkey" PRIMARY KEY ("serial")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassCertificate_studentId_key" ON "ClassCertificate"("studentId");

-- CreateIndex
CREATE INDEX "ClassCertificate_studentId_idx" ON "ClassCertificate"("studentId");
