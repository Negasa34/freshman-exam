/*
  Warnings:

  - Added the required column `fileUrl` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
