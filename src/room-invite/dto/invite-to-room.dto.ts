import { IsNotEmpty, IsString } from 'class-validator';

export class InviteToRoomDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  inviteeId: string;
}
