/*
  Warnings:

  - You are about to drop the column `attachments` on the `FieldNote` table. All the data in the column will be lost.
  - You are about to drop the column `energy` on the `FieldNote` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `FieldNote` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `FieldNote` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FieldNote" DROP COLUMN "attachments",
DROP COLUMN "energy",
DROP COLUMN "mood",
DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "password";
