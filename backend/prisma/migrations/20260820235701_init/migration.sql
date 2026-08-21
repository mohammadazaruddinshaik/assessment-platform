/*
  Warnings:

  - You are about to drop the `MCQConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MCQConfig" DROP CONSTRAINT "MCQConfig_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- DropTable
DROP TABLE "MCQConfig";

-- DropTable
DROP TABLE "QuestionOption";

-- DropEnum
DROP TYPE "MCQSelectionType";
