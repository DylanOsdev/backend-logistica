import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { BaseEntity } from '../../common/database/base.entity';

export enum CategoryStatus {
  ACTIVA = 'Activa',
  INACTIVA = 'Inactiva',
}

@Entity({ name: 'categorias' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id_categoria' })
  id: number;

  @Column({ unique: true, length: 50 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVA,
  })
  estado: CategoryStatus;

  @OneToMany(() => Product, (product) => product.category)
  productos: Product[];
}
