import { ConfigService } from '@nestjs/config';

export const jwtConfigFactory = (configService: ConfigService) => {
  return {
    secret: configService.get<string>('JWT_SECRET_KEY', { infer: true }),
    signOptions: {
      expiresIn: configService.get<string>('TOKEN_EXPIRE_TIME', '3600s'),
    },
  };
};
