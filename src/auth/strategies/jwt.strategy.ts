import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: number; correo: string; rol: string }) {
    const usuario = await this.usersService.findById(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException('Token inválido o usuario eliminado');
    }
    // El objeto retornado aquí se convierte en req.user
    return { idUsuario: payload.sub, correo: payload.correo, rol: payload.rol };
  }
}
