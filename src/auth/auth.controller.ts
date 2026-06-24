import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserCredentialsValidationGuard } from './guards/user-credentials-validation.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticatedRequest } from '../types/interfaces/authenticatedRequest';
import { Response, Request } from 'express';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { RefreshGuard } from './guards/refresh.guard';
import { Public } from '../common/decorators/public.decorator';

interface UserTokens {
  userId: string;
  username: string;
  accessToken: string;
}

const REFRESH_TOKEN_COOKIE = 'refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/auth/refresh',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(UserCredentialsValidationGuard, AuthGuard('local'))
  @Post('login')
  @HttpCode(StatusCodes.OK)
  async login(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) response: Response): Promise<UserTokens> {
    const { refreshToken, ...rest } = await this.authService.loginUser(req.user);

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);

    return rest;
  }

  @Public()
  @Post('signup')
  @HttpCode(StatusCodes.CREATED)
  signup(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const cookies = request.cookies as Record<string, string | undefined>;
    const oldRefreshToken = cookies[REFRESH_TOKEN_COOKIE];

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, refreshToken } = await this.authService.refreshToken(oldRefreshToken);

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);

    return { accessToken };
  }

  @Post('logout')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const cookies = request.cookies as Record<string, string | undefined>;
    const refreshToken = cookies[REFRESH_TOKEN_COOKIE];

    await this.authService.logout(user.userId, refreshToken);

    response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/auth/refresh' });

    return { message: 'Logged out successfully' };
  }
}
