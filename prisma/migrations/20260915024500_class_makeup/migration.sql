-- CreateTable
CREATE TABLE "ClassMakeup" (
    "studentId" TEXT NOT NULL,
    "sessionDate" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,
    "total" INTEGER,

    CONSTRAINT "ClassMakeup_pkey" PRIMARY KEY ("studentId","sessionDate")
);
