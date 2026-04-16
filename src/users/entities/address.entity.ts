import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'direcciones_clientes' })
export class UserAddress {
  @PrimaryGeneratedColumn('increment', { name: 'id_direccion' })
  id: number;

  @Column({ name: 'id_usuario' })
  userId: number;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ length: 50, nullable: true })
  alias: string; // Ej: 'Casa', 'Oficina'

  @Column({ name: 'direccion_texto', length: 200 })
  direccion: string;

  @Column({ length: 100, nullable: true })
  barrio: string;

  @Column({ name: 'es_principal', default: false })
  esPrincipal: boolean;
}
