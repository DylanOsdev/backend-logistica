import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule, // Necesitamos UsersService para buscar usuarios

    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configuración de JWT con valores del .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: {
          // cast necesario: @nestjs/jwt v11 usa tipo StringValue de 'ms'
          expiresIn: (config.get<string>('JWT_EXPIRATION') ?? '7d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // JwtModule exportado para uso en otros módulos
})
export class AuthModule {}
