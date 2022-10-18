import { Module } from '@nestjs/common';
import { DriverMainService } from './driver-main.service';
import { DriverMainController } from './driver-main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { User } from 'src/database/user.entity';
import { DriverMainSecondController } from './driver-main-second.controller';
import { Shipment } from 'src/database/shipment.entity';
import { DriverMainSecondService } from './driver-main-second.service';
import { ShipmentsSocketsModule } from 'src/sockets/shipments-sockets/shp-sockets.module';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';
import { DriverVehicleController } from './driver-vehicle.controller';
import { VehicleData } from 'src/database/vehicle-data.entity';
import { DriverVehicleService } from './driver-vehicle.service';
import { Helper } from 'src/utils/helpers/helper';
import { UserService } from 'src/utils/auth/user/user.service';
import { AuthModule } from 'src/utils/auth/auth.module';
import { Notification } from 'src/database/notification.entity';
import { ClientSocketsModule } from 'src/sockets/client-sockets/client-sockets.module';
import { VehicleType } from 'src/database/vehicle-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Journey, Vehicle, Shipment,ShipmentOffer,VehicleData,Notification,VehicleType]),ShipmentsSocketsModule,Helper,AuthModule, ClientSocketsModule],
  controllers: [DriverMainController, DriverMainSecondController, DriverVehicleController],
  providers: [DriverMainService, DriverMainSecondService,DriverVehicleService,Helper,UserService,],
  exports: [DriverMainService, DriverMainSecondService,DriverVehicleService,Helper],
})
export class DriverMainModule {}
