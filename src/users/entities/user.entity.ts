import { User } from '@prisma/client';

export class UserEntity {
  id: string;
  username: string;
  version: number;
  createdAt: number;
  updatedAt: number;
  name: string | null;
  surname: string | null;
  email: string | null;
  isOnline: boolean;
  lastSeenAt: number | null;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.version = user.version;
    this.name = user.name;
    this.surname = user.surname;
    this.email = user.email;
    this.createdAt = new Date(user.createdAt).getTime();
    this.updatedAt = new Date(user.updatedAt).getTime();
    this.isOnline = user.isOnline;
    this.lastSeenAt = user.lastSeenAt ? new Date(user.lastSeenAt).getTime() : null;
  }
}
