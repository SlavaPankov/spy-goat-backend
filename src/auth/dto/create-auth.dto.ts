import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Login is required.' })
  @IsString({ message: 'Login must be a string' })
  login: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
