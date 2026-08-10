/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_organizationId_idx";

-- DropIndex
DROP INDEX "Category_organizationId_name_key";

-- DropIndex
DROP INDEX "Question_organizationId_idx";

-- DropIndex
DROP INDEX "Tag_organizationId_idx";

-- DropIndex
DROP INDEX "Tag_organizationId_name_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "organizationId";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
