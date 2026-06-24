import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExcludePasswordInterceptor } from './common/interceptors/exclude-password.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ExcludePasswordInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
