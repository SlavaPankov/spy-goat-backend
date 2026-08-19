import { WsJwtGuard } from './ws-jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

const buildContext = (exp: number) => {
  const client = { data: { exp }, emit: jest.fn(), disconnect: jest.fn() } as unknown as Socket & {
    emit: jest.Mock;
    disconnect: jest.Mock;
  };
  const context = { switchToWs: () => ({ getClient: () => client }) } as unknown as ExecutionContext;

  return { context, client };
};

describe('WsJwtGuard', () => {
  let guard: WsJwtGuard;

  beforeEach(() => {
    guard = new WsJwtGuard();
  });

  it('allows the request through when the token has not expired yet', () => {
    const { context, client } = buildContext(Date.now() + 60_000);

    expect(guard.canActivate(context)).toBe(true);
    expect(client.disconnect).not.toHaveBeenCalled();
  });

  it('rejects and disconnects the socket once the token has expired', () => {
    const { context, client } = buildContext(Date.now() - 1000);

    expect(guard.canActivate(context)).toBe(false);
    expect(client.emit).toHaveBeenCalledWith('auth_error', { code: 'TOKEN_EXPIRED' });
    expect(client.disconnect).toHaveBeenCalled();
  });
});
