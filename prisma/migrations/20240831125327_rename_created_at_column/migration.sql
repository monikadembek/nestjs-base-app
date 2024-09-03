/*
  Warnings:

  - You are about to drop the column `updatedNow` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedNow",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
