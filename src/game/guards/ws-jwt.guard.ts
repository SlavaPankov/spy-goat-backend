import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    if (Date.now() > (client.data as Record<string, number>).exp) {
      client.emit('auth_error', { code: 'TOKEN_EXPIRED' });
      client.disconnect();

      return false;
    }

    return true;
  }
}
