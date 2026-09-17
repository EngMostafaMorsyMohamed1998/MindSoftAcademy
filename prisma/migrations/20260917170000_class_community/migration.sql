-- CreateTable
CREATE TABLE "ClassCommunityPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "groupId" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassCommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassCommunityComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassCommunityComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassCommunityLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "ClassCommunityLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassCommunityPost_createdAt_idx" ON "ClassCommunityPost"("createdAt");

-- CreateIndex
CREATE INDEX "ClassCommunityComment_postId_idx" ON "ClassCommunityComment"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassCommunityLike_postId_studentId_key" ON "ClassCommunityLike"("postId", "studentId");

-- CreateIndex
CREATE INDEX "ClassCommunityLike_postId_idx" ON "ClassCommunityLike"("postId");
