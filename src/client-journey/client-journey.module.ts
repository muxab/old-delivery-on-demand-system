import { Module } from '@nestjs/common';
import { ClientJourneyService } from './client-journey.service';
import { ClientJourneyController } from './client-journey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Location } from 'src/database/location.entity';
import { Shipment } from 'src/database/shipment.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { User } from 'src/database/user.entity';
import { VtypeModule } from 'src/vtype/vtype.module';
import { ShipmentModule } from 'src/shipment/shipment.module';
import { LocationModule } from 'src/location/location.module';
import { Trip } from 'src/database/trip.entity';
import { TripModule } from 'src/trip/trip.module';
import { ClientSocketsModule } from 'src/sockets/client-sockets/client-sockets.module';
import { Vehicle } from 'src/database/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Journey,
      Location,
      Shipment,
      VehicleType,
      User,
      Trip,
      Vehicle,
    ]),
    LocationModule,
    ShipmentModule,
    VtypeModule,
    TripModule,
    ClientSocketsModule,
  ],
  controllers: [ClientJourneyController],
  providers: [ClientJourneyService],
  exports: [ClientJourneyService],
})
export class ClientJourneyModule {}
