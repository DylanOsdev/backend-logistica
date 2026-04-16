import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginAttempt } from './entities/login-attempt.entity';
import { PriceHistory } from './entities/price-history.entity';
import { InventoryAudit } from './entities/inventory-audit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginAttempt, PriceHistory, InventoryAudit]),
  ],
  exports: [TypeOrmModule],
})
export class AuditModule {}
