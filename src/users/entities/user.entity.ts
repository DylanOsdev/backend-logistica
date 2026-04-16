import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAddress } from './address.entity';

// Volvemos a los nombres originales para no romper los Services y Guards
export enum RolUsuario {
  ADMIN = 'Admin',
  EMPLEADO = 'Empleado',
  CLIENTE = 'Cliente',
}

export enum EstadoUsuario {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
  BLOQUEADO = 'Bloqueado',
}

export enum AvailabilityStatus {
  DISPONIBLE = 'Disponible',
  OCUPADO = 'Ocupado',
}

@Entity({ name: 'usuarios' })
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'id_usuario' })
  idUsuario: number; // Corregido: Coincide con lo que usan los Services

  @Column({ name: 'nombre_completo', length: 100 })
  nombreCompleto: string;

  @Column({ unique: true, length: 100 })
  correo: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: RolUsuario, // Corregido
  })
  rol: RolUsuario;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'date', name: 'fecha_nacimiento', nullable: true })
  fechaNacimiento: Date;

  @Column({
    type: 'enum',
    enum: EstadoUsuario, // Corregido
    default: EstadoUsuario.ACTIVO,
  })
  estado: EstadoUsuario;

  @Column({
    name: 'disponibilidad_reparto',
    type: 'enum',
    enum: AvailabilityStatus,
    nullable: true,
  })
  disponibilidadReparto: AvailabilityStatus;

  @Column({ name: 'aceptacion_habeas_data', default: true })
  aceptacionHabeasData: boolean;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @OneToMany(() => UserAddress, (address) => address.user)
  addresses: UserAddress[];
}
