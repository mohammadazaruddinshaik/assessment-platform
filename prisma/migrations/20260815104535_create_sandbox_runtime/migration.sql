/*
  Warnings:

  - You are about to drop the column `version` on the `Language` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SandboxRuntimeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "version";

-- CreateTable
CREATE TABLE "SandboxRuntime" (
    "id" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "runtimeName" TEXT NOT NULL,
    "runtimeVersion" TEXT NOT NULL,
    "status" "SandboxRuntimeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SandboxRuntime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SandboxRuntime_languageId_idx" ON "SandboxRuntime"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "SandboxRuntime_languageId_runtimeVersion_key" ON "SandboxRuntime"("languageId", "runtimeVersion");

-- AddForeignKey
ALTER TABLE "SandboxRuntime" ADD CONSTRAINT "SandboxRuntime_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
