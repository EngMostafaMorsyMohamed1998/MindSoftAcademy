-- CreateTable
CREATE TABLE "ClassCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "usedById" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClassCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassMessage" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "readByTeacher" BOOLEAN NOT NULL DEFAULT false,
    "readByStudent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ClassMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassExam" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "objectiveScore" INTEGER NOT NULL,
    "objectiveTotal" INTEGER NOT NULL,
    "essays" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassHomework" (
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassHomework_pkey" PRIMARY KEY ("studentId","lessonId")
);

-- CreateTable
CREATE TABLE "ClassUnlock" (
    "studentId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassUnlock_pkey" PRIMARY KEY ("studentId","chapterId")
);

-- CreateTable
CREATE TABLE "ClassEssayGrade" (
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "gradedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassEssayGrade_pkey" PRIMARY KEY ("examId","questionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassCode_code_key" ON "ClassCode"("code");

-- CreateIndex
CREATE INDEX "ClassCode_phone_idx" ON "ClassCode"("phone");

-- CreateIndex
CREATE INDEX "ClassMessage_studentId_createdAt_idx" ON "ClassMessage"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "ClassExam_studentId_chapterId_idx" ON "ClassExam"("studentId", "chapterId");
