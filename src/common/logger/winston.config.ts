import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { resolve } from 'path';

const logDir = resolve(process.cwd(), 'logs');

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // Transporte a consola con colores y formato tipo NestJS
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        utilities.format.nestLike('LOGISTICA-API', { 
          prettyPrint: true,
          colors: true 
        })
      ),
    }),

    // Archivo para errores solamente
    new winstonDaily({
      filename: `${logDir}/errors-%DATE%.log`,
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),

    // Archivo combinado para todos los niveles de log
    new winstonDaily({
      filename: `${logDir}/combined-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],

  // Formato base para los archivos
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
});
