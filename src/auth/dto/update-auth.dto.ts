import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthDto {
  @IsNotEmpty({ message: 'The refresh token is required.' })
  @IsString({ message: 'The refresh token must be a string.' })
  refreshToken: string;
}
