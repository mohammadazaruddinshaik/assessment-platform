-- CreateEnum
CREATE TYPE "CodingExecutionMode" AS ENUM ('STDIN_STDOUT', 'FUNCTION');

-- CreateTable
CREATE TABLE "CodingQuestionConfig" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "executionMode" "CodingExecutionMode" NOT NULL,
    "timeLimitMs" INTEGER NOT NULL,
    "memoryLimitMb" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodingQuestionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CodingQuestionConfig_questionId_key" ON "CodingQuestionConfig"("questionId");

-- AddForeignKey
ALTER TABLE "CodingQuestionConfig" ADD CONSTRAINT "CodingQuestionConfig_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
