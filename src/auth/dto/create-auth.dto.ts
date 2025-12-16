import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Login is required.' })
  @IsString({ message: 'Login must be a string' })
  login: string;
  @IsString({ message: 'Password must be a string.' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
