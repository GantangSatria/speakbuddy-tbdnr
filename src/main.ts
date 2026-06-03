import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip properti yang tidak ada di DTO
      forbidNonWhitelisted: true,
      transform: true,          // auto-cast @Query param ke tipe yang benar
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Prefix & CORS
  app.setGlobalPrefix('api');
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀  Server        : http://localhost:${port}/api`);
  logger.log(`📦  MongoDB       : ${process.env.MONGO_URI ?? 'mongodb://localhost:27017/speakbuddy_db'}`);
  logger.log(`🔴  Redis         : stub (rancangan — belum aktif)`);
}

bootstrap();