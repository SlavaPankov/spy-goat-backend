import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketResponseBuilder } from './types/socket-response.types';

@Injectable()
export class SocketServerService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  getServer() {
    return this.server;
  }

  emitToRoom<T>(roomId: string, event: string, data: T, eventId?: string): void {
    this.server.to(roomId).emit(event, SocketResponseBuilder.success(data, eventId));
  }

  emitError(client: Socket, event: string, error: unknown, data?: unknown): void {
    client.emit(event, SocketResponseBuilder.fromError(error, undefined, data));
  }
}
