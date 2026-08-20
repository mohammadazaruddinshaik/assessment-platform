/*
  Warnings:

  - Added the required column `organization_id` to the `department_section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "department_section" ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "department_section" ADD CONSTRAINT "department_section_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
