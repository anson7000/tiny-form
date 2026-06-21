/*
  Warnings:

  - You are about to drop the column `replied_at` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `submissions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "submissions_form_id_created_at_idx";

-- DropIndex
DROP INDEX "submissions_form_id_status_idx";

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "replied_at",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "Status";
