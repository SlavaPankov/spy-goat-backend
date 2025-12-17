import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { skipAuth } from './decorators/skipAuth.decorator';
import { UserCredentialsValidationGuard } from './guards/userCredentialsValidation.guard';
import { RefreshTokenAuthGuard } from './guards/RefreshTokenAuth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticatedRequest } from '../types/interfaces/authenticatedRequest';

interface UserTokens {
  userId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
}

@skipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(UserCredentialsValidationGuard, AuthGuard('local'))
  @Post('login')
  @HttpCode(StatusCodes.OK)
  login(@Req() req: AuthenticatedRequest): Promise<UserTokens> {
    return this.authService.loginUser(req.user);
  }

  @Post('signup')
  @HttpCode(StatusCodes.CREATED)
  signup(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  @HttpCode(StatusCodes.OK)
  async refresh(@Body() updateAuthDto: UpdateAuthDto) {
    return await this.authService.refreshToken(updateAuthDto);
  }
}
