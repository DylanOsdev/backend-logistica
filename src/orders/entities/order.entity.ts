import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetail } from './order-detail.entity';

export enum PaymentMethod {
  EFECTIVO = 'Efectivo',
  TRANSFERENCIA = 'Transferencia',
  TARJETA = 'Tarjeta',
  DATAFONO = 'Datafono',
}

export enum OrderStatus {
  PENDIENTE = 'Pendiente',
  CONFIRMADO = 'Confirmado',
  EN_CAMINO = 'En_Camino',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado',
  DEVUELTO = 'Devuelto',
}

export enum OrderOrigin {
  WEB = 'Web',
  POS = 'POS',
  TELEFONO = 'Telefono',
  WHATSAPP = 'WhatsApp',
}

@Entity({ name: 'pedidos' })
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'id_pedido' })
  id: number;

  @Column({ name: 'id_cliente', nullable: true })
  clientId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_cliente' })
  client: User;

  @Column({ name: 'id_empleado_encargado', nullable: true })
  employeeId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_empleado_encargado' })
  employee: User;

  @Column({ name: 'nombre_contacto', length: 100 })
  nombreContacto: string;

  @Column({ name: 'telefono_contacto', length: 20 })
  telefonoContacto: string;

  @Column({ name: 'direccion_entrega', length: 255 })
  direccionEntrega: string;

  @Column({ name: 'email_contacto', length: 100, nullable: true })
  emailContacto: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    name: 'metodo_pago',
    type: 'enum',
    enum: PaymentMethod,
  })
  metodoPago: PaymentMethod;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE,
  })
  estado: OrderStatus;

  @Column({ name: 'codigo_otp', length: 6, nullable: true })
  codigoOtp: string;

  @Column({
    type: 'enum',
    enum: OrderOrigin,
    default: OrderOrigin.WEB,
  })
  origen: OrderOrigin;

  @Column({ name: 'notas_especiales', type: 'text', nullable: true })
  notasEspeciales: string;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  details: OrderDetail[];
}
