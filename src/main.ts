import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription(
      'Auth (register, verify, login), Article (CRUD + file upload), Guards, Roles, Interceptors, Filters',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT ?? 4001;
  await app.listen(PORT, () => {
    logger.log(`Root api for project: http://localhost:${PORT}`);
    logger.log(`Root api for swagger: http://localhost:${PORT}/docs`);
  });
}
bootstrap();
