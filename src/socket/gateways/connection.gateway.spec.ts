import { ConnectionGateway } from './connection.gateway';
import { JwtService } from '@nestjs/jwt';
import { SocketServerService } from '../socket-server.service';
import { PresenceService } from '../../presence/presence.service';
import { Server, Socket } from 'socket.io';

type JwtServiceMock = { verify: jest.Mock };
type SocketServerServiceMock = { setServer: jest.Mock };
type PresenceServiceMock = { registerConnection: jest.Mock; registerDisconnection: jest.Mock };

const USER_ID = 'USER_ID';
const SOCKET_ID = 'socket-1';

const buildClient = (overrides: { auth?: Record<string, unknown>; headers?: Record<string, unknown> } = {}) =>
  ({
    id: SOCKET_ID,
    setMaxListeners: jest.fn(),
    handshake: { auth: overrides.auth ?? {}, headers: overrides.headers ?? {} },
    emit: jest.fn(),
    disconnect: jest.fn(),
    join: jest.fn(),
    data: {} as Record<string, unknown>,
  }) as unknown as Socket & {
    setMaxListeners: jest.Mock;
    emit: jest.Mock;
    disconnect: jest.Mock;
    join: jest.Mock;
    data: Record<string, unknown>;
  };

describe('ConnectionGateway', () => {
  let gateway: ConnectionGateway;
  let jwtService: JwtServiceMock;
  let socketServer: SocketServerServiceMock;
  let presenceService: PresenceServiceMock;

  beforeEach(() => {
    jwtService = { verify: jest.fn() };
    socketServer = { setServer: jest.fn() };
    presenceService = { registerConnection: jest.fn(), registerDisconnection: jest.fn() };

    gateway = new ConnectionGateway(
      jwtService as unknown as JwtService,
      socketServer as unknown as SocketServerService,
      presenceService as unknown as PresenceService
    );
  });

  describe('afterInit', () => {
    it('registers the socket.io server with SocketServerService', () => {
      const server = {} as Server;

      gateway.afterInit(server);

      expect(socketServer.setServer).toHaveBeenCalledWith(server);
    });
  });

  describe('handleConnection', () => {
    it('rejects the connection when no token is provided at all', async () => {
      const client = buildClient();

      await gateway.handleConnection(client);

      expect(jwtService.verify).not.toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalledWith('auth_error', { code: 'NO_TOKEN', message: 'No token provided' });
      expect(client.disconnect).toHaveBeenCalled();
    });

    it('falls back to the authorization header when auth.token is absent', async () => {
      const client = buildClient({ headers: { authorization: 'header-token' } });
      jwtService.verify.mockReturnValue({ userId: USER_ID, exp: 1000 });
      presenceService.registerConnection.mockResolvedValue(undefined);

      await gateway.handleConnection(client);

      expect(jwtService.verify).toHaveBeenCalledWith('header-token');
    });

    it('rejects with TOKEN_EXPIRED when the token has expired', async () => {
      const client = buildClient({ auth: { token: 'expired-token' } });
      const expiredError = new Error('jwt expired');
      expiredError.name = 'TokenExpiredError';
      jwtService.verify.mockImplementation(() => {
        throw expiredError;
      });

      await gateway.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith('auth_error', {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
      });
      expect(client.disconnect).toHaveBeenCalled();
    });

    it('rejects with TOKEN_INVALID for any other verification failure', async () => {
      const client = buildClient({ auth: { token: 'garbage-token' } });
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      await gateway.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith('auth_error', {
        code: 'TOKEN_INVALID',
        message: 'Token is invalid',
      });
      expect(client.disconnect).toHaveBeenCalled();
    });

    it('registers the connection and joins the user room on a valid token', async () => {
      const client = buildClient({ auth: { token: 'valid-token' } });
      jwtService.verify.mockReturnValue({ userId: USER_ID, exp: 1700000000 });
      presenceService.registerConnection.mockResolvedValue(undefined);

      await gateway.handleConnection(client);

      expect(client.data.userId).toBe(USER_ID);
      expect(client.data.exp).toBe(1700000000 * 1000);
      expect(client.join).toHaveBeenCalledWith(`user:${USER_ID}`);
      expect(presenceService.registerConnection).toHaveBeenCalledWith(USER_ID, SOCKET_ID);
      expect(client.disconnect).not.toHaveBeenCalled();
      expect(client.emit).not.toHaveBeenCalledWith('auth_error', expect.anything());
    });

    it('treats a presence-registration failure the same as an invalid token', async () => {
      const client = buildClient({ auth: { token: 'valid-token' } });
      jwtService.verify.mockReturnValue({ userId: USER_ID, exp: 1700000000 });
      presenceService.registerConnection.mockRejectedValue(new Error('db down'));

      await gateway.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith('auth_error', { code: 'TOKEN_INVALID', message: 'Token is invalid' });
      expect(client.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('does nothing when the socket was never authenticated', async () => {
      const client = buildClient();

      await gateway.handleDisconnect(client);

      expect(presenceService.registerDisconnection).not.toHaveBeenCalled();
    });

    it('registers the disconnection for an authenticated user', async () => {
      const client = buildClient();
      client.data.userId = USER_ID;

      await gateway.handleDisconnect(client);

      expect(presenceService.registerDisconnection).toHaveBeenCalledWith(USER_ID, SOCKET_ID);
    });
  });
});
