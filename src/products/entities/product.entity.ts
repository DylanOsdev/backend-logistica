import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export enum ProductStatus {
  ACTIVO = 'Activo',
  DESCONTINUADO = 'Descontinuado',
}

@Entity({ name: 'productos' })
export class Product {
  @PrimaryGeneratedColumn('increment', { name: 'id_producto' })
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'id_categoria', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.productos)
  @JoinColumn({ name: 'id_categoria' })
  category: Category;

  @Column({ name: 'precio_venta', type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ name: 'costo_unitario', type: 'decimal', precision: 10, scale: 2 })
  costoUnitario: number;

  @Column({ name: 'stock_actual', default: 0 })
  stockActual: number;

  @Column({ name: 'stock_minimo', default: 5 })
  stockMinimo: number;

  @Column({ name: 'lote_vencimiento', type: 'date', nullable: true })
  loteVencimiento: Date;

  @Column({ name: 'imagen_url', length: 255, nullable: true })
  imagenUrl: string;

  @Column({ name: 'codigo_barras', length: 50, unique: true, nullable: true })
  codigoBarras: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVO,
  })
  estado: ProductStatus;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;
}
