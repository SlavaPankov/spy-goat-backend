import { Expose } from 'class-transformer';

export class PublicUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  isOnline: boolean;

  @Expose()
  lastSeenAt: Date | null;
}
