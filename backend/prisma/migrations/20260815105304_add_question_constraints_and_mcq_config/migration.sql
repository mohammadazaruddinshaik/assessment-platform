-- CreateEnum
CREATE TYPE "MCQSelectionType" AS ENUM ('SINGLE', 'MULTIPLE');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "constraints" TEXT;

-- CreateTable
CREATE TABLE "MCQConfig" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectionType" "MCQSelectionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCQConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCaseMedia" (
    "id" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCaseMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MCQConfig_questionId_key" ON "MCQConfig"("questionId");

-- CreateIndex
CREATE INDEX "TestCaseMedia_testCaseId_idx" ON "TestCaseMedia"("testCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "TestCaseMedia_testCaseId_displayOrder_key" ON "TestCaseMedia"("testCaseId", "displayOrder");

-- AddForeignKey
ALTER TABLE "MCQConfig" ADD CONSTRAINT "MCQConfig_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseMedia" ADD CONSTRAINT "TestCaseMedia_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
