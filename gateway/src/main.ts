import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function parseAllowedOrigins(rawOrigins: string): string[] {
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const fallbackOrigins = nodeEnv === 'production'
    ? ''
    : 'http://localhost:3000,http://localhost:3001';

  const rawOrigins = process.env.CORS_ALLOWED_ORIGINS || process.env.CORS_ORIGIN || fallbackOrigins;
  const allowedOrigins = parseAllowedOrigins(rawOrigins);
  const allowAllOrigins = allowedOrigins.includes('*');

  const allowCredentials = process.env.CORS_ALLOW_CREDENTIALS
    ? process.env.CORS_ALLOW_CREDENTIALS === 'true'
    : !allowAllOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowAllOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS origin not allowed'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: allowCredentials,
  });

  const config = new DocumentBuilder()
    .setTitle("API Gateway")
    .setDescription("Gateway da plataforma de microservices")
    .setVersion("1.0")
    .addBearerAuth()
    .build();


  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
