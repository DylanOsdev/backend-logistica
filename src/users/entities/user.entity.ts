import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum RolUsuario {
  ADMIN = 'Admin',
  EMPLEADO = 'Empleado',
  CLIENTE = 'Cliente',
}

export enum EstadoUsuario {
  ACTIVO = 'Activo',
  BLOQUEADO = 'Bloqueado',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'id_usuario' })
  idUsuario: number;

  @Column({ type: 'varchar', length: 100, name: 'nombre_completo' })
  nombreCompleto: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  correo: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.CLIENTE })
  rol: RolUsuario;

  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'date', name: 'fecha_nacimiento', nullable: true })
  fechaNacimiento: Date;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;
}
