-- AlterTable
ALTER TABLE "ClassCode" ADD COLUMN "suspendedAt" TIMESTAMP(3);
ALTER TABLE "ClassCode" ADD COLUMN "suspendReason" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "ClassAttendance" (
    "studentId" TEXT NOT NULL,
    "sessionDate" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassAttendance_pkey" PRIMARY KEY ("studentId","sessionDate")
);

-- CreateTable
CREATE TABLE "ClassAnnouncement" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClassAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassExamWindow" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "opensAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassExamWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassMiss" (
    "studentId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "promptAr" TEXT NOT NULL,
    "promptEn" TEXT NOT NULL,
    "optionsAr" JSONB NOT NULL,
    "optionsEn" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "missedAt" TIMESTAMP(3) NOT NULL,
    "clearedAt" TIMESTAMP(3),

    CONSTRAINT "ClassMiss_pkey" PRIMARY KEY ("studentId","questionKey")
);
