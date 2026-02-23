-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "winnerId" TEXT;

-- CreateTable
CREATE TABLE "RoomStats" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "completedGames" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerRoomStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "totalPenalty" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER,
    "lastPlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerRoomStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomStats_roomId_key" ON "RoomStats"("roomId");

-- CreateIndex
CREATE INDEX "PlayerRoomStats_roomId_idx" ON "PlayerRoomStats"("roomId");

-- CreateIndex
CREATE INDEX "PlayerRoomStats_userId_idx" ON "PlayerRoomStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerRoomStats_userId_roomId_key" ON "PlayerRoomStats"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomStats" ADD CONSTRAINT "RoomStats_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoomStats" ADD CONSTRAINT "PlayerRoomStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoomStats" ADD CONSTRAINT "PlayerRoomStats_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
