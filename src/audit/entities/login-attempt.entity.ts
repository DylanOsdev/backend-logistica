import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'intentos_login' })
export class LoginAttempt {
  @PrimaryGeneratedColumn('increment', { name: 'id_intento' })
  id: number;

  @Column({ length: 100 })
  correo: string;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'fecha_intento' })
  fechaIntento: Date;

  @Column()
  exitoso: boolean;

  @Column({ length: 255, nullable: true })
  detalles: string;
}
