/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,code]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "roles_code_idx";

-- DropIndex
DROP INDEX "roles_code_key";

-- CreateIndex
CREATE INDEX "roles_organization_id_idx" ON "roles"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_organization_id_code_key" ON "roles"("organization_id", "code");
