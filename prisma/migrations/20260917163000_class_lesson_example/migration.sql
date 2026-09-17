-- CreateTable
CREATE TABLE "ClassLessonExample" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "bodyAr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassLessonExample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassLessonExample_lessonId_idx" ON "ClassLessonExample"("lessonId");
