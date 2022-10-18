import { Module } from '@nestjs/common';
import { UserNotificationService } from './user-notification.service';
import { UserNotificationController } from './user-notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Notification } from 'src/database/notification.entity';
import { GloabalService } from 'src/utils/extra/global.service';
import { Shipment } from 'src/database/shipment.entity';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification,Shipment,ShipmentOffer])],
  controllers: [UserNotificationController],
  providers: [UserNotificationService, GloabalService],
  exports: [UserNotificationService],
})
export class UserNotificationModule {}
