import { Module } from '@nestjs/common';
import { AccountantService } from './accountant.service';
import { AccountantController } from './accountant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Invoice } from 'src/database/invoice.entity';
import { Shipment } from 'src/database/shipment.entity';
import { AccountantShipmentService } from './services/accountant_shipment.service';
import { AccountantClientController } from './controllers/accountant_client.controller';
import { AccountantDriverController } from './controllers/accountant_driver.controller';
import { AccountantJourneysController } from './controllers/accountant_journeys.controller';
import { AccountantShipmentController } from './controllers/accountant_shipment.controller';
import { AccountantVehiclesController } from './controllers/accountant_vehciles.controller';
import { AccountantJourneysService } from './services/accountant_journeys.service';
import { Journey } from 'src/database/journey.entity';
import { AccountantClientsService } from './services/accountant_clients.service';
import { AccountantDriversService } from './services/accountant_drivers.service';
import { Company } from 'src/database/company.entity';
import { AccountantCompanyService } from './services/accountant_company.service';
import { AccountantCompanyController } from './controllers/accountant_company.controller';
import { GloabalService } from 'src/utils/extra/global.service';
import { ClientShipmentService } from 'src/client-shipment/client-shipment.service';
import { UserService } from 'src/utils/auth/user/user.service';
import { Vehicle } from 'src/database/vehicle.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Location } from 'src/database/location.entity';
import { AccountantVehicleService } from './services/accountant_vehicle.service';
import { CompanyType } from 'src/database/company-type.entity';
import { JourneyService } from 'src/journey/journey.service';
import { DriverJourneyService } from 'src/driver-journey/driver-journey.service';
import { LocationService } from 'src/location/location.service';
import { TripService } from 'src/trip/trip.service';
import { Trip } from 'src/database/trip.entity';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';
import { ShipmentsSocketsModule } from 'src/sockets/shipments-sockets/shp-sockets.module';
import { Notification } from 'src/database/notification.entity';
import { ClientSocketsModule } from 'src/sockets/client-sockets/client-sockets.module';
import { DriverSocketsModule } from 'src/sockets/driver-sockets/driver-sockets.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Invoice, 
    Shipment,
    Journey,
    Company, 
    CompanyType ,
    Vehicle,
    VehicleType,
    Location,
    Trip,
    ShipmentOffer,
    Notification
  ]),
  GloabalService,
  ShipmentsSocketsModule,
  ClientSocketsModule,
  DriverSocketsModule,
],
  controllers: [
    AccountantController,
    AccountantShipmentController,
    AccountantClientController,
    AccountantDriverController,
    AccountantJourneysController,
    AccountantVehiclesController,
    AccountantCompanyController,
  ],
  providers: [
    AccountantService, 
    AccountantShipmentService,
    AccountantJourneysService,
    AccountantClientsService,
    AccountantDriversService,
    AccountantCompanyService,
    AccountantVehicleService,
    AccountantCompanyService,
    ClientShipmentService,
    GloabalService,
    UserService,
    JourneyService,
    DriverJourneyService,
    LocationService,
    TripService,
  ],
})
export class AccountantModule { }
