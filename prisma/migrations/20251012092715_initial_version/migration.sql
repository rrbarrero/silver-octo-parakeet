/*
  Warnings:

  - Added the required column `ownerId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "JobApplication_ownerId_appliedAt_idx" ON "JobApplication"("ownerId", "appliedAt");
