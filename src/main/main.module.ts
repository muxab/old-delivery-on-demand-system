import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import { MainController } from './main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/database/location.entity';
import { Journey } from 'src/database/journey.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { User } from 'src/database/user.entity';
import { Trip } from 'src/database/trip.entity';
import { GeneralSocketsModule } from 'src/sockets/general-sockets/general-sockets.module';
import { VehicleType } from 'src/database/vehicle-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Journey, Vehicle, User, Trip, VehicleType,]),
    GeneralSocketsModule,
  ],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
