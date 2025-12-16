import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request?.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    try {
      const secretKey = this.configService.get<string>(
        'JWT_SECRET_REFRESH_KEY',
      );

      await this.jwtService.verifyAsync(refreshToken, { secret: secretKey });
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token.');
    }

    return true;
  }
}
