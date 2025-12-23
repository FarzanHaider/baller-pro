import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 5000;
  const nodeEnv = configService.get<string>('nodeEnv');

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS
  const corsOrigins = configService.get<string[]>('cors.origins') || ['http://localhost:8081'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation (only in development)
  if (nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Project Baller API')
      .setDescription('Football Training App Backend API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('user', 'User management endpoints')
      .addTag('training', 'Workouts and programs')
      .addTag('habits', 'Habit tracking')
      .addTag('nutrition', 'Nutrition and recipes')
      .addTag('community', 'Social features')
      .addTag('challenges', 'Challenges and leaderboards')
      .addTag('shop', 'E-commerce')
      .addTag('subscriptions', 'Premium subscriptions')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap();
