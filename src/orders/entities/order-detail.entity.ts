import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'detalle_pedido' })
export class OrderDetail {
  @PrimaryGeneratedColumn('increment', { name: 'id_detalle' })
  id: number;

  @Column({ name: 'id_pedido' })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'id_pedido' })
  order: Order;

  @Column({ name: 'id_producto' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_producto' })
  product: Product;

  @Column()
  cantidad: number;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({
    name: 'subtotal_linea',
    type: 'decimal',
    precision: 10,
    scale: 2,
    insert: false,
    update: false,
  })
  subtotalLinea: number; 
}
