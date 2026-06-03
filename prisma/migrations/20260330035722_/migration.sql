/*
  Warnings:

  - A unique constraint covering the columns `[gameId,position,roomId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Player_gameId_position_key";

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_position_roomId_key" ON "Player"("gameId", "position", "roomId");
