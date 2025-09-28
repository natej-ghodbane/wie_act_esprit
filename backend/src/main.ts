import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

let app: NestExpressApplication;

export default async function handler(req: any, res: any) {
  if (!app) {
    const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn'],
      abortOnError: false,
    });

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    nestApp.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3002',
        'https://chabiba-7hxd.vercel.app',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    nestApp.setGlobalPrefix('api');

    await nestApp.init();
    app = nestApp;
  }

  // Let Nest handle the incoming request
  return app.getHttpAdapter().getInstance()(req, res);
}
