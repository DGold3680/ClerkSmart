/*
  Warnings:

  - A unique constraint covering the columns `[autumnCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "autumnCustomerId" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "subscriptionPlan" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'trial',
ADD COLUMN     "trialsUsed" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "user_autumnCustomerId_key" ON "user"("autumnCustomerId");
