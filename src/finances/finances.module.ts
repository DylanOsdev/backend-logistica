import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashExpense } from './entities/cash-expense.entity';
import { CashAudit } from './entities/cash-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashExpense, CashAudit])],
  exports: [TypeOrmModule],
})
export class FinancesModule {}
