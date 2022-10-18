import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './utils/auth/auth.module';
import { ClientSocketsModule } from './sockets/client-sockets/client-sockets.module';
import { DriverSocketsModule } from './sockets/driver-sockets/driver-sockets.module';
import { GeneralSocketsModule } from './sockets/general-sockets/general-sockets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClientJourneyModule } from './client-journey/client-journey.module';
import { LocationModule } from './location/location.module';
import { VtypeModule } from './vtype/vtype.module';
import { JourneyModule } from './journey/journey.module';
import { ShipmentModule } from './shipment/shipment.module';
import { TripModule } from './trip/trip.module';
import { MainModule } from './main/main.module';
import { DriverJourneyModule } from './driver-journey/driver-journey.module';
import { AccountantModule } from './accountant/accountant.module';
import { AccountantConfirmJourneyModule } from './accountant-confirm-journey/accountant-confirm-journey.module';
import { PaymentModule } from './payment/payment.module';
import { MulterModule } from '@nestjs/platform-express';
import { ClientModule } from './users/client/client.module';
import { DriverModule } from './users/driver/driver.module';
import { StaffModule } from './users/staff/staff.module';
import { AdminModule } from './admin/admin.module';
import { Location } from './database/location.entity';
import { DriverMainModule } from './driver-main/driver-main.module';
import { JourneyService } from './journey-sort/journey/journey.service';
import { ClientShipmentModule } from './client-shipment/client-shipment.module';
import { OushiService } from './second/trip/oushi/oushi.service';
import { UserNotificationModule } from './user-notification/user-notification.module';
import { AccountantSocketsModule } from './sockets/accountant-sockets/acc-sockets.module';
import { JourneysSocketsModule } from './sockets/journeys-sockets/shp-jou-sockets.module';
import { ShipmentsSocketsModule } from './sockets/shipments-sockets/shp-sockets.module';
import { Shipment } from './database/shipment.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    JwtModule.register({
      secretOrPrivateKey: 'nestJsTutorial',
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: 'root',
      password: '',
      database: 'nql_fv',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Shipment]),
    MulterModule.register({
      dest: './img',
    }),
    AuthModule,
    ClientJourneyModule,
    LocationModule,
    VtypeModule,
    JourneyModule,
    ShipmentModule,
    TripModule,
    MainModule,
    // ConfirmJourneyModule,
    DriverJourneyModule,
    AccountantModule,
    AccountantConfirmJourneyModule,
    PaymentModule,
    DriverModule,
    ClientModule,
    StaffModule,
    AdminModule,
    DriverMainModule,
    ClientShipmentModule,
    UserNotificationModule,

    // Gateways Modules
    ClientSocketsModule,
    DriverSocketsModule,
    GeneralSocketsModule,
    AccountantSocketsModule,
    JourneysSocketsModule,
    ShipmentsSocketsModule,
  
  ],
  controllers: [AppController],
  providers: [AppService, OushiService],
})
export class AppModule {}
