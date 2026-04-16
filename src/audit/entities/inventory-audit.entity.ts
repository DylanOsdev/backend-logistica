import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum InventoryAction {
  VENTA = 'Venta',
  COMPRA = 'Compra',
  AJUSTE_MANUAL = 'Ajuste_Manual',
  DEVOLUCION = 'Devolucion',
  MERMA = 'Merma',
}

@Entity({ name: 'auditoria_inventario' })
export class InventoryAudit {
  @PrimaryGeneratedColumn('increment', { name: 'id_log' })
  id: number;

  @Column({ name: 'id_producto' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_producto' })
  product: Product;

  @Column({ name: 'id_detalle_pedido', nullable: true })
  orderDetailId: number;

  @Column({
    type: 'enum',
    enum: InventoryAction,
  })
  accion: InventoryAction;

  @Column({ name: 'cantidad_afectada' })
  cantidadAfectada: number;

  @Column({ name: 'stock_antes' })
  stockAntes: number;

  @Column({ name: 'stock_despues' })
  stockDespues: number;

  @Column({ type: 'text', nullable: true })
  motivo: string;

  @Column({ name: 'usuario_responsable', length: 100, nullable: true })
  usuarioResponsable: string;

  @CreateDateColumn({ name: 'fecha_movimiento' })
  fechaMovimiento: Date;
}
