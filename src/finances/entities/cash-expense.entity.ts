import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'gastos_caja' })
export class CashExpense {
  @PrimaryGeneratedColumn('increment', { name: 'id_gasto' })
  id: number;

  @Column({ name: 'id_empleado' })
  employeeId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_empleado' })
  employee: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ length: 255 })
  descripcion: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;
}
