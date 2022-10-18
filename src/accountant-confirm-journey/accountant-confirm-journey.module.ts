import { Module } from '@nestjs/common';
import { AccountantConfirmJourneyService } from './accountant-confirm-journey.service';
import { AccountantConfirmJourneyController } from './accountant-confirm-journey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Journey } from 'src/database/journey.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Trip } from 'src/database/trip.entity';
import { GeneralSocketsModule } from 'src/sockets/general-sockets/general-sockets.module';
import { JourneyModule } from 'src/journey/journey.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journey, User, Vehicle, VehicleType, Trip]),
    GeneralSocketsModule,
    JourneyModule,
  ],
  controllers: [AccountantConfirmJourneyController],
  providers: [AccountantConfirmJourneyService],
  exports: [AccountantConfirmJourneyService],
})
export class AccountantConfirmJourneyModule {}
