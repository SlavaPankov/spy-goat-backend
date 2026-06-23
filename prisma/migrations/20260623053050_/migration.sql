/*
  Warnings:

  - You are about to drop the column `replayToId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_replayToId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "replayToId",
ADD COLUMN     "replyToId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
