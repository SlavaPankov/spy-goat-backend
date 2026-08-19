import { UnauthorizedException } from '@nestjs/common';
import { SessionJwtStrategy } from './session-jwt.strategy';
import { ConfigService } from '@nestjs/config';

type ConfigServiceMock = { get: jest.Mock };

describe('SessionJwtStrategy', () => {
  let strategy: SessionJwtStrategy;
  let configService: ConfigServiceMock;

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('test-secret') };
    strategy = new SessionJwtStrategy(configService as unknown as ConfigService);
  });

  it('throws when the payload has no userId', () => {
    expect(() => strategy.validate({ userId: '', username: 'alice' })).toThrow(UnauthorizedException);
  });

  it('throws when the payload has no username', () => {
    expect(() => strategy.validate({ userId: 'user-1', username: '' })).toThrow(UnauthorizedException);
  });

  it('returns the userId/username pair for a valid payload', () => {
    const result = strategy.validate({ userId: 'user-1', username: 'alice' });

    expect(result).toEqual({ userId: 'user-1', username: 'alice' });
  });
});
