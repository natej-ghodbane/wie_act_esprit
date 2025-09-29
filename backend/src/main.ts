import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

let appInstance: NestExpressApplication | null = null;

async function createApp(): Promise<NestExpressApplication> {
  if (appInstance) {
    return appInstance;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
    abortOnError: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'https://chabiba-7hxd.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  appInstance = app;
  return appInstance;
}

// Serverless/Vercel handler export
export default async function handler(req: any, res: any) {
  const app = await createApp();
  if (!(app as any).isInitialized) {
    await app.init();
    (app as any).isInitialized = true;
  }
  return app.getHttpAdapter().getInstance()(req, res);
}

// Standalone bootstrap when running locally (npm start)
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  // Optional log to confirm startup
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}/api`);
}

// Avoid starting a listener on Vercel/Serverless
if (!process.env.VERCEL) {
  // no await to avoid blocking serverless import
  bootstrap();
}
