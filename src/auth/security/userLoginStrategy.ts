import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class UserLoginStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.verifyUserCredentials({
      username,
      password,
    });

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    return user;
  }
}
