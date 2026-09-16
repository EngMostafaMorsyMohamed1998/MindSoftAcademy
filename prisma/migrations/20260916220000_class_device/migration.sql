-- CreateTable
CREATE TABLE "ClassDevice" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "firstAt" TIMESTAMP(3) NOT NULL,
    "lastAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassDeviceLimit" (
    "id" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,

    CONSTRAINT "ClassDeviceLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassDevice_studentId_idx" ON "ClassDevice"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassDevice_studentId_deviceId_key" ON "ClassDevice"("studentId", "deviceId");
