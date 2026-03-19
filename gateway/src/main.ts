import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Usar cookie-parser middleware
  app.use(cookieParser());

  // Enable CORS com suporte a cookies
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:4000';
  app.enableCors({
    origin: corsOrigin,
    credentials: true, // Permite envio de cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Gateway is running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
