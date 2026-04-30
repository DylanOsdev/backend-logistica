import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
  DataSource,
} from 'typeorm';
import { Product } from '../entities/product.entity';
import { PriceHistory } from '../../audit/entities/price-history.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    // Registramos manualmente el subscriber en el DataSource
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  async beforeUpdate(event: UpdateEvent<Product>): Promise<void> {
    // Si no hay entidad siendo actualizada o no existe la entidad en DB, salimos
    if (!event.entity || !event.databaseEntity) return;

    const oldPrice = Number(event.databaseEntity.precioVenta);
    const newPrice = Number(event.entity.precioVenta);

    // Solo guardamos si el precio de venta cambió
    if (oldPrice !== newPrice) {
      const priceHistory = new PriceHistory();
      
      // Mapeamos los campos según tu entidad PriceHistory
      priceHistory.productId = event.databaseEntity.id;
      priceHistory.precioAnterior = oldPrice;
      priceHistory.precioNuevo = newPrice;
      
      // Por ahora hardcodeamos el usuario (ID 1 suele ser admin/sistema)
      // En el futuro esto se saca de un CLS o contexto de transacción
      priceHistory.responsibleUserId = 1;

      // Usamos el manager de la transacción actual si existe, para atomicidad
      await event.manager.save(PriceHistory, priceHistory);
    }
  }
}
