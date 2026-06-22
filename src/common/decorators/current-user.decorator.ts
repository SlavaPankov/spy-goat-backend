import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Интерфейс для JWT payload
export interface JwtPayload {
  userId: string;
  username: string;
}

// Типизированный Request
interface RequestWithUser {
  user: JwtPayload;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | string => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new Error('User not found in request');
    }

    if (data) {
      return user[data];
    }

    return user;
  }
);
