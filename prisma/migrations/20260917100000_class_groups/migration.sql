-- AlterTable
ALTER TABLE "ClassTelegramBot" ADD COLUMN IF NOT EXISTS "teacherChatId" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "ClassGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "nextLesson" TEXT NOT NULL,
    "studentIds" TEXT NOT NULL,
    "remindedOn" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ClassGroup_pkey" PRIMARY KEY ("id")
);
