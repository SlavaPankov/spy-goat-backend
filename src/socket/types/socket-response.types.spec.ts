import { SocketResponseBuilder } from './socket-response.types';

describe('SocketResponseBuilder', () => {
  describe('success', () => {
    it('wraps the message in a success envelope with a timestamp', () => {
      const result = SocketResponseBuilder.success({ id: 1 }, 'event-1');

      expect(result.success).toBe(true);
      expect(result.message).toEqual({ id: 1 });
      expect(result.eventId).toBe('event-1');
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('error', () => {
    it('builds an error envelope with the given fields', () => {
      const result = SocketResponseBuilder.error('Bad request', 'BAD_REQUEST', { field: 'name' });

      expect(result).toEqual(
        expect.objectContaining({
          success: false,
          error: 'Bad request',
          code: 'BAD_REQUEST',
          data: { field: 'name' },
        })
      );
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('fromError', () => {
    it('extracts the message and constructor name from an Error instance', () => {
      class CustomError extends Error {}
      const err = new CustomError('custom failure');

      const result = SocketResponseBuilder.fromError(err, 'fallback', { extra: true });

      expect(result).toEqual(
        expect.objectContaining({ success: false, error: 'custom failure', code: 'CustomError', data: { extra: true } })
      );
    });

    it('falls back to the default message for a non-Error value', () => {
      const result = SocketResponseBuilder.fromError('just a string', 'fallback message');

      expect(result).toEqual(expect.objectContaining({ success: false, error: 'fallback message', code: undefined }));
    });

    it('uses "Unknown error" when no default message is provided', () => {
      const result = SocketResponseBuilder.fromError(42);

      expect(result.error).toBe('Unknown error');
    });
  });
});
