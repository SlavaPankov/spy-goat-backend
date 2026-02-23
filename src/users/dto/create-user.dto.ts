import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MatchDecorator } from '../../common/decorators/match.decorator';

export class CreateUserDto {
  @IsString({ message: 'Login must be a string' })
  @IsNotEmpty({ message: 'Login required' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password required' })
  password: string;

  @IsString({ message: 'Password confirmation must be a string' })
  @IsNotEmpty({ message: 'Password confirmation required' })
  @MatchDecorator('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;
}
