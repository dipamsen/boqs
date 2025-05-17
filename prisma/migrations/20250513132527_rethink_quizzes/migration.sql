/*
  Warnings:

  - You are about to drop the column `bankId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdById` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_createdById_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "bankId",
DROP COLUMN "type",
ADD COLUMN     "collectionId" TEXT NOT NULL,
ALTER COLUMN "createdById" SET NOT NULL;

-- DropEnum
DROP TYPE "QuizType";

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
