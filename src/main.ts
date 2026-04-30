import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { winstonConfig } from './common/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  // Activa class-validator en todos los DTOs globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos no declarados en los DTOs
      forbidNonWhitelisted: true, // Error si envían campos extra
      transform: true, // Convierte tipos automáticamente (string → number)
    }),
  );

  // CORS abierto en desarrollo (restringir en producción)
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Backend corriendo en: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
void bootstrap();
