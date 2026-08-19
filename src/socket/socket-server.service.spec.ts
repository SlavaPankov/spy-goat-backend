import { SocketServerService } from './socket-server.service';
import { Server, Socket } from 'socket.io';

describe('SocketServerService', () => {
  let service: SocketServerService;

  beforeEach(() => {
    service = new SocketServerService();
  });

  describe('setServer / getServer', () => {
    it('stores and returns the socket.io server instance', () => {
      const server = {} as Server;

      service.setServer(server);

      expect(service.getServer()).toBe(server);
    });
  });

  describe('emitToRoom', () => {
    it('emits a success envelope to the given room', () => {
      const emit = jest.fn();
      const to = jest.fn().mockReturnValue({ emit });
      service.setServer({ to } as unknown as Server);

      service.emitToRoom('room-1', 'game.update', { foo: 'bar' }, 'event-1');

      expect(to).toHaveBeenCalledWith('room-1');
      expect(emit).toHaveBeenCalledWith(
        'game.update',
        expect.objectContaining({ success: true, message: { foo: 'bar' }, eventId: 'event-1' })
      );
    });

    it('works without an eventId', () => {
      const emit = jest.fn();
      const to = jest.fn().mockReturnValue({ emit });
      service.setServer({ to } as unknown as Server);

      service.emitToRoom('room-1', 'game.update', { foo: 'bar' });

      expect(emit).toHaveBeenCalledWith(
        'game.update',
        expect.objectContaining({ success: true, message: { foo: 'bar' }, eventId: undefined })
      );
    });
  });

  describe('emitError', () => {
    it('emits an error envelope built from an Error instance', () => {
      const client = { emit: jest.fn() } as unknown as Socket;
      const error = new Error('Something broke');

      service.emitError(client, 'game.error', error);

      expect(client.emit).toHaveBeenCalledWith(
        'game.error',
        expect.objectContaining({ success: false, error: 'Something broke', code: 'Error' })
      );
    });

    it('emits a default error message for a non-Error value', () => {
      const client = { emit: jest.fn() } as unknown as Socket;

      service.emitError(client, 'game.error', 'not an error object', { extra: 'data' });

      expect(client.emit).toHaveBeenCalledWith(
        'game.error',
        expect.objectContaining({ success: false, error: 'Unknown error', data: { extra: 'data' } })
      );
    });
  });
});
