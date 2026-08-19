-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'GIF');

-- CreateTable
CREATE TABLE "QuestionMedia" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionMedia_questionId_idx" ON "QuestionMedia"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionMedia_questionId_displayOrder_key" ON "QuestionMedia"("questionId", "displayOrder");

-- AddForeignKey
ALTER TABLE "QuestionMedia" ADD CONSTRAINT "QuestionMedia_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
