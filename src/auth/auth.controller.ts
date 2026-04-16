import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { RolUsuario } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Registro de nuevos clientes
   * Valida que el usuario tenga mínimo 18 años
   * POST /auth/register
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * Inicio de Sesión — retorna JWT
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Cierre de Sesión
   * POST /auth/logout
   * Nota: El JWT es stateless. El frontend debe eliminar el token.
   * Para invalidación real, se usará Redis en la Fase 2 (blacklist de tokens).
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: any) {
    return {
      message: `Sesión cerrada correctamente. Elimina el token del lado del cliente.`,
      usuario: req.user.correo,
    };
  }

  /**
   * Recuperación de contraseña vía correo
   * POST /auth/forgot-password
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.correo);
  }

  /**
   * Admin bloquea el acceso de un usuario
   * PATCH /auth/users/:id/block
   */
  @Patch('users/:id/block')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  async blockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.blockUser(id);
  }
}
