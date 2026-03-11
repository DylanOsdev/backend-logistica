import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RolUsuario, EstadoUsuario } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * RF-01: Registro de Clientes
   * RF-02: Validación de Edad (mínimo 18 años)
   */
  async register(dto: CreateUserDto) {
    // Validación de edad mínima 18 años (RF-02)
    const fechaNac = new Date(dto.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const ajuste =
      hoy < new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate())
        ? 1
        : 0;
    const edadReal = edad - ajuste;

    if (edadReal < 18) {
      throw new BadRequestException(
        'Debes ser mayor de 18 años para registrarte en nuestra plataforma.',
      );
    }

    // Unicidad de correo (RF-01: Unicidad)
    const existente = await this.usersService.findByEmail(dto.correo);
    if (existente) {
      throw new ConflictException(
        'Ya existe una cuenta con este correo electrónico.',
      );
    }

    // Hash de contraseña (nunca texto plano en BD)
    const SALT_ROUNDS = 10;
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Guardar usuario
    const nuevoUsuario = await this.usersService.save({
      nombreCompleto: dto.nombreCompleto,
      correo: dto.correo,
      passwordHash,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      telefono: dto.telefono,
      rol: dto.rol ?? RolUsuario.CLIENTE,
      estado: EstadoUsuario.ACTIVO,
    });

    // Retornar sin el hash de contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...usuarioSinPassword } = nuevoUsuario;
    return usuarioSinPassword;
  }

  /**
   * RF-04: Inicio de Sesión — genera JWT
   */
  async login(dto: LoginDto) {
    const usuario = await this.usersService.findByEmail(dto.correo);

    // Usuario no existe o está bloqueado (RF-08)
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    if (usuario.estado === EstadoUsuario.BLOQUEADO) {
      throw new UnauthorizedException(
        'Tu cuenta ha sido bloqueada. Contacta al administrador.',
      );
    }

    // Verificar contraseña contra el hash guardado (RF-04: Cifrado)
    const passwordValida = await bcrypt.compare(
      dto.password,
      usuario.passwordHash,
    );
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Generar JWT con payload mínimo
    const payload = {
      sub: usuario.idUsuario,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      rol: usuario.rol,
      nombre: usuario.nombreCompleto,
    };
  }

  /**
   * RF-06: Recuperación de contraseña (placeholder — pendiente integración de email)
   */
  async forgotPassword(correo: string) {
    const usuario = await this.usersService.findByEmail(correo);
    // Por seguridad, siempre responde igual (no revela si el correo existe)
    if (!usuario) {
      return {
        message:
          'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.',
      };
    }
    // TODO: Integrar servicio de email (Nodemailer / SendGrid) en Fase 2
    return {
      message:
        'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.',
    };
  }
}
