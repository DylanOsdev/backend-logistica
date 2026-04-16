import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'historial_precios' })
export class PriceHistory {
  @PrimaryGeneratedColumn('increment', { name: 'id_historial' })
  id: number;

  @Column({ name: 'id_producto' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_producto' })
  product: Product;

  @Column({ name: 'precio_anterior', type: 'decimal', precision: 10, scale: 2 })
  precioAnterior: number;

  @Column({ name: 'precio_nuevo', type: 'decimal', precision: 10, scale: 2 })
  precioNuevo: number;

  @CreateDateColumn({ name: 'fecha_cambio' })
  fechaCambio: Date;

  @Column({ name: 'id_usuario_responsable' })
  responsibleUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_responsable' })
  responsibleUser: User;
}
