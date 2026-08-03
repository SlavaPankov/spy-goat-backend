import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { SocketServerService } from '../socket-server.service';
import { PresenceService } from '../../presence/presence.service';

enum SocketConnectionError {
  NO_TOKEN = 'NO_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
}

@WebSocketGateway(8082, { cors: true })
export class ConnectionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly socketServer: SocketServerService,
    private readonly presenceService: PresenceService
  ) {}

  afterInit(server: Server): void {
    this.socketServer.setServer(server);
    console.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      client.setMaxListeners(20);

      const token = (client.handshake.auth.token || client.handshake.headers.authorization) as string;

      if (!token) {
        client.emit('auth_error', {
          code: SocketConnectionError.NO_TOKEN,
          message: 'No token provided',
        });
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      (client.data as Record<string, unknown>).userId = payload.userId;
      (client.data as Record<string, unknown>).exp = payload.exp * 1000;

      console.log(`Connected: ${client.id}, userId: ${payload.userId}`);

      await client.join(`user:${payload.userId}`);
      await this.presenceService.registerConnection(payload.userId, client.id);
    } catch (err) {
      const isExpired = err instanceof Error && err.name === 'TokenExpiredError';

      client.emit('auth_error', {
        code: isExpired ? SocketConnectionError.TOKEN_EXPIRED : SocketConnectionError.TOKEN_INVALID,
        message: isExpired ? 'Token has expired' : 'Token is invalid',
      });

      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log(`Disconnected: ${client.id}`);

    const userId = (client.data as Record<string, unknown>).userId as string | undefined;

    if (userId) {
      await this.presenceService.registerDisconnection(userId, client.id);
    }
  }
}
