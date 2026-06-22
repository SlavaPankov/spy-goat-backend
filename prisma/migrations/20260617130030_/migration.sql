-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_playerId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
