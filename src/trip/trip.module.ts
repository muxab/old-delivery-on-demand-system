import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/database/trip.entity';
import { Location } from 'src/database/location.entity';
import { LocationModule } from 'src/location/location.module';
import { OushiService } from './oushi/oushi.service';
import { SecondService } from './oushi/second/second.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Location]), LocationModule],
  controllers: [TripController],
  providers: [TripService, OushiService, SecondService],
  exports: [TripService],
})
export class TripModule {}
