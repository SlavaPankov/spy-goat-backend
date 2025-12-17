import { Room } from '@prisma/client';

export class RoomEntity {
  id: string;
  name: string;
  code: string;
  status: string;
  maxPlayers: number;
  isPrivate: boolean;
  creatorId: string;

  constructor(room: Room) {
    this.id = room.id;
    this.name = room.name;
    this.code = room.code;
    this.status = room.status;
    this.maxPlayers = room.maxPlayers;
    this.isPrivate = room.isPrivate;
    this.creatorId = room.creatorId;
  }
}
