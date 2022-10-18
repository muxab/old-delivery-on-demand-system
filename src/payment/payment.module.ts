import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentGateway } from './payment.gateway';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/database/invoice.entity';
import { Shipment } from 'src/database/shipment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Invoice,Shipment])],
  providers: [PaymentGateway, PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
