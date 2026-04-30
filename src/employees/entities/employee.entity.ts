import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/database/base.entity';

export enum DisponibilidadEmpleado {
  DISPONIBLE = 'Disponible',
  OCUPADO = 'Ocupado',
}

@Entity('empleados')
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id_empleado' })
  idEmpleado: number;

  // Relación 1-a-1: cada empleado está vinculado a un usuario del sistema
  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column({
    type: 'enum',
    enum: DisponibilidadEmpleado,
    default: DisponibilidadEmpleado.DISPONIBLE,
    name: 'disponibilidad_reparto',
  })
  disponibilidadReparto: DisponibilidadEmpleado;
}
