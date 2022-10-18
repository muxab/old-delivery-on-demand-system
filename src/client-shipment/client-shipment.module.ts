import { Module } from '@nestjs/common';
import { ClientShipmentService } from './client-shipment.service';
import { ClientShipmentController } from './client-shipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Shipment } from 'src/database/shipment.entity';
import { Trip } from 'src/database/trip.entity';
import { User } from 'src/database/user.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { ClientJourneyModule } from 'src/client-journey/client-journey.module';
import { Location } from 'src/database/location.entity';
import { LocationModule } from 'src/location/location.module';
import { ShipmentModule } from 'src/shipment/shipment.module';
import { VtypeModule } from 'src/vtype/vtype.module';
import { TripModule } from 'src/trip/trip.module';
import { GloabalService } from 'src/utils/extra/global.service';
import { JourneyService } from 'src/journey/journey.service';
import { JourneyModule } from 'src/journey/journey.module';
import { ShipmentsSocketsModule } from 'src/sockets/shipments-sockets/shp-sockets.module';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';
import { ClientShipmentSecondService } from './client-shipment-second.service';
import { Notification } from 'src/database/notification.entity';
import { DriverSocketsModule } from 'src/sockets/driver-sockets/driver-sockets.module';

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
      ShipmentOffer,
      Notification,
    ]),
    ClientJourneyModule,
    LocationModule,
    JourneyModule,
    ShipmentModule,
    VtypeModule,
    TripModule,
    ShipmentsSocketsModule,
    DriverSocketsModule,
  ],
  controllers: [ClientShipmentController],
  providers: [ClientShipmentService, ClientShipmentSecondService ,GloabalService,JourneyService],
  exports: [ClientShipmentService],
})
export class ClientShipmentModule {}
