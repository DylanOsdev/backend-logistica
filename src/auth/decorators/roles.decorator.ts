import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Decorador para proteger endpoints por rol.
 * Uso: @Roles(RolUsuario.ADMIN) o @Roles('Admin', 'Empleado')
 */
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
