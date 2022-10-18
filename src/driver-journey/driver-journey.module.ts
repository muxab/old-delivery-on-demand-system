import { Module } from '@nestjs/common';
import { DriverJourneyService } from './driver-journey.service';
import { DriverJourneyController } from './driver-journey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { Notification } from 'src/database/notification.entity';
import { Journey } from 'src/database/journey.entity';
import { ClientSocketsModule } from 'src/sockets/client-sockets/client-sockets.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, VehicleType, Vehicle, Journey,Notification,]),ClientSocketsModule],
  controllers: [DriverJourneyController],
  providers: [DriverJourneyService],
  exports: [DriverJourneyService],
})
export class DriverJourneyModule {}
