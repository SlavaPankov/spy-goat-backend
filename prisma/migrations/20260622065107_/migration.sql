-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "replayToId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replayToId_fkey" FOREIGN KEY ("replayToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
