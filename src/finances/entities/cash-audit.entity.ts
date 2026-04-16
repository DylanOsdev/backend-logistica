import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'arqueos_caja' })
export class CashAudit {
  @PrimaryGeneratedColumn('increment', { name: 'id_arqueo' })
  id: number;

  @Column({ name: 'id_empleado' })
  employeeId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_empleado' })
  employee: User;

  @CreateDateColumn({ name: 'fecha_cierre' })
  fechaCierre: Date;

  @Column({ name: 'ventas_sistema', type: 'decimal', precision: 10, scale: 2 })
  ventasSistema: number;

  @Column({
    name: 'gastos_registrados',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  gastosRegistrados: number;

  @Column({ name: 'monto_esperado', type: 'decimal', precision: 10, scale: 2 })
  montoEsperado: number;

  @Column({ name: 'monto_real', type: 'decimal', precision: 10, scale: 2 })
  montoReal: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    insert: false,
    update: false,
  })
  diferencia: number; 

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}
