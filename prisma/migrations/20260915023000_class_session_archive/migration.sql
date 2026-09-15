-- CreateTable
CREATE TABLE "ClassSessionArchive" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "chapterId" TEXT,
    "closedAt" TIMESTAMP(3) NOT NULL,
    "presentCount" INTEGER NOT NULL,
    "absentCount" INTEGER NOT NULL,
    "unmarkedCount" INTEGER NOT NULL,
    "examCount" INTEGER NOT NULL,
    "averagePercent" INTEGER,
    "students" JSONB NOT NULL,

    CONSTRAINT "ClassSessionArchive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassSessionArchive_date_idx" ON "ClassSessionArchive"("date");
