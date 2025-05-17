/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Quiz` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_collectionId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "collectionId",
ADD COLUMN     "bankId" TEXT;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "QuestionBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
