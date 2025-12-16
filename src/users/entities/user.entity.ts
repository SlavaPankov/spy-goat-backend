import { User } from '@prisma/client';

export class UserEntity {
  id: string;
  username: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.version = user.version;
    this.createdAt = new Date(user.createdAt).getTime();
    this.updatedAt = new Date(user.updatedAt).getTime();
  }
}
