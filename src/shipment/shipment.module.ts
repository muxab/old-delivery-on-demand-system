import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from 'src/database/shipment.entity';
import { ShipmentSortService } from './shipment-sort.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment])],
  controllers: [ShipmentController],
  providers: [ShipmentService, ShipmentSortService],
  exports: [ShipmentService],
})
export class ShipmentModule {}
