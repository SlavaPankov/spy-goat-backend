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

enum SocketConnectionError {
  NO_TOKEN = 'NO_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
}

@WebSocketGateway(8082, { cors: true })
export class ConnectionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly socketServer: SocketServerService
  ) {}

  afterInit(server: Server): void {
    this.socketServer.setServer(server);
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket): void {
    try {
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
    } catch (err) {
      const isExpired = err instanceof Error && err.name === 'TokenExpiredError';

      client.emit('auth_error', {
        code: isExpired ? SocketConnectionError.TOKEN_EXPIRED : SocketConnectionError.TOKEN_INVALID,
        message: isExpired ? 'Token has expired' : 'Token is invalid',
      });

      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Disconnected: ${client.id}`);
  }
}
