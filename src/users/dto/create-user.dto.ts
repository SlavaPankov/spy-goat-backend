import { IsString, IsNotEmpty } from 'class-validator';
import { Match } from '../../decorators/match';

export class CreateUserDto {
  @IsString({ message: 'Login must be a string' })
  @IsNotEmpty({ message: 'Login required' })
  login: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Login required' })
  password: string;

  @IsString({ message: 'Password confirmation must be a string' })
  @IsNotEmpty({ message: 'Password confirmation required' })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
