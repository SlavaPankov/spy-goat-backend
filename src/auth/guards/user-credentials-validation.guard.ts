import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserCredentialsValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { username, password } = request.body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('Login and password must be provided and be strings');
    }

    return true;
  }
}
