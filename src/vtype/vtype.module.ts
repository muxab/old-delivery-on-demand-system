import { Module } from '@nestjs/common';
import { VtypeService } from './vtype.service';
import { VtypeController } from './vtype.controller';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleType])],
  controllers: [VtypeController],
  providers: [VtypeService],
  exports: [VtypeService],
})
export class VtypeModule {}
