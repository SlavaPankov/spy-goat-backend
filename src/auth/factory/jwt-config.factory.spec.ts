import { ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from './jwt-config.factory';

describe('jwtConfigFactory', () => {
  it('reads the secret and expiry from ConfigService', () => {
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET_KEY') return 'my-secret';
        if (key === 'TOKEN_EXPIRE_TIME') return '7200s';
        return undefined;
      }),
    } as unknown as ConfigService;

    const config = jwtConfigFactory(configService);

    expect(config).toEqual({
      secret: 'my-secret',
      signOptions: { expiresIn: '7200s' },
    });
  });

  it('falls back to the default expiresIn when TOKEN_EXPIRE_TIME is unset', () => {
    const configService = {
      get: jest.fn((key: string, fallback?: string) => {
        if (key === 'JWT_SECRET_KEY') return 'my-secret';
        return fallback;
      }),
    } as unknown as ConfigService;

    const config = jwtConfigFactory(configService);

    expect(config.signOptions).toEqual({ expiresIn: '3600s' });
  });
});
