import { User } from '@prisma/client';

export class UserEntity {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(user: User) {
    this.id = user.id;
    this.login = user.login;
    this.version = user.version;
    this.createdAt = new Date(user.createdAt).getTime();
    this.updatedAt = new Date(user.updatedAt).getTime();
  }
}
