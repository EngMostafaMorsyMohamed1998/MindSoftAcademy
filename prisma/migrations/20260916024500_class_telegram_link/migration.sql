-- CreateTable
CREATE TABLE "ClassTelegramLink" (
    "chatId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "parentName" TEXT NOT NULL DEFAULT '',
    "linkedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassTelegramLink_pkey" PRIMARY KEY ("chatId")
);

-- CreateIndex
CREATE INDEX "ClassTelegramLink_studentId_idx" ON "ClassTelegramLink"("studentId");

-- CreateIndex
CREATE INDEX "ClassTelegramLink_phone_idx" ON "ClassTelegramLink"("phone");
