import { Request } from 'express';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';
import { ConfigService } from '@nestjs/config';

type ConfigServiceMock = { get: jest.Mock };
type StrategyWithExtractor = RefreshJwtStrategy & { _jwtFromRequest: (req: Request) => string | null };

describe('RefreshJwtStrategy', () => {
  let strategy: RefreshJwtStrategy;
  let configService: ConfigServiceMock;

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('test-refresh-secret') };
    strategy = new RefreshJwtStrategy(configService as unknown as ConfigService);
  });

  it('passes the decoded payload straight through', () => {
    const payload = { userId: 'user-1', username: 'alice' };

    const result = strategy.validate(payload);

    expect(result).toBe(payload);
  });

  it('extracts the refresh token from the refresh_token cookie', () => {
    const extractor = (strategy as StrategyWithExtractor)._jwtFromRequest;
    const req = { cookies: { refresh_token: 'the-token' } } as unknown as Request;

    expect(extractor(req)).toBe('the-token');
  });

  it('returns null when there is no refresh_token cookie', () => {
    const extractor = (strategy as StrategyWithExtractor)._jwtFromRequest;
    const req = { cookies: {} } as unknown as Request;

    expect(extractor(req)).toBeNull();
  });

  it('returns null when the request has no cookies at all', () => {
    const extractor = (strategy as StrategyWithExtractor)._jwtFromRequest;
    const req = {} as unknown as Request;

    expect(extractor(req)).toBeNull();
  });
});
