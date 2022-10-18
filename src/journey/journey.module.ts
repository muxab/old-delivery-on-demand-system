import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Shipment } from 'src/database/shipment.entity';
import { Journey } from 'src/database/journey.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { JourneySortService } from './journey-sort/journey-sort.service';
import { TripService } from 'src/trip/trip.service';
import { LocationService } from 'src/location/location.service';
import { LocationModule } from 'src/location/location.module';
import { TripModule } from 'src/trip/trip.module';
import { Trip } from 'src/database/trip.entity';
import { Location } from 'src/database/location.entity';
import { GloabalService } from 'src/utils/extra/global.service';
import { Vehicle } from 'src/database/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Journey, VehicleType, Journey,Trip,Location,Vehicle]),LocationModule,TripModule],
  controllers: [JourneyController],
  providers: [JourneyService, JourneySortService,TripService,LocationService,GloabalService],
  exports: [JourneyService],
})
export class JourneyModule {}
