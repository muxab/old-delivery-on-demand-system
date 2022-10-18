import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Location } from 'src/database/location.entity';
import { Notification } from 'src/database/notification.entity';
import { User } from 'src/database/user.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { ClientSocketsGateway } from 'src/sockets/client-sockets/client-sockets.gateway';
import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { NotificationType } from 'src/utils/enums/nType.enum';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { Status } from 'src/utils/enums/vstatus.enum';
import { Repository } from 'typeorm';

@Injectable()
export class DriverJourneyService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleType) private vTypeRepo: Repository<VehicleType>,
    @InjectRepository(Journey) private journeyRep: Repository<Journey>,
    @InjectRepository(Notification) private notificationRep: Repository<Notification>,
    private clientGate: ClientSocketsGateway,
  ) { }


  async showJourney(journeyUuid: string, user: User): Promise<any> {

    const vehicle = await this.vehicleRepo.findOne({
      driver: user,
    });
    const journey = await this.journeyRep.findOne({
      where: {
        uuid: journeyUuid,
        vehicle: vehicle,
      },
      relations: ['destination', 'origin', 'shipments'],
    });

    console.log(journey);

    if (!journey) {
      return new HttpException({ msg: 'error' }, HttpStatus.NOT_FOUND);
    } else {
      return { journey: journey };
    }
  }


  // confrim picking up and moving 
  async confirmJourneyOnWay(journeyUuid: string, user: User): Promise<any> {
    const vehicle = await this.vehicleRepo.findOne({
      driver: user,
    });
    const journey = await this.journeyRep.findOne({
      where: {
        uuid: journeyUuid,
        vehicle: vehicle
      },
      relations: ['shipments'],
    });



    if (!journey) {
      return new HttpException({ msg: 'error' }, HttpStatus.NOT_FOUND);
    } else {

      journey.status = JourneyStatus.ON_VEHICLE;

      journey.shipments.forEach(async singleShipment => {
        singleShipment.status = ShipmentStatus.ON_VEHICLE;
        singleShipment.save();
        const not = this.notificationRep.create({
          message: 'انطلقت المركبة وتحمل شحنتك',
          userId: singleShipment.ownerId,
          type: NotificationType.SHIPMENT,
        })
        const gateNot = await this.notificationRep.save(not);
        // this.clientGate.clientNotifications(singleShipment.owner.b_id, gateNot);
      });

      journey.save();

      vehicle.status = Status.ON_TRIP;
      vehicle.save();
      // const client: User = journey.owner;
      // journey.owner = undefined;

      //socket Later and use client ID,,,,
      return journey
    }
  }

  //COnfirm Journey Delivery
  async confirmJourneyDeleiverd(journeyUuid: string, user: User): Promise<any> {
    const vehicle = await this.vehicleRepo.findOne({
      driver: user,
    });
    const journey = await this.journeyRep.findOne({
      where: {
        uuid: journeyUuid,
        vehicle: vehicle
      },
      relations: ['shipments'],
    });
    if (!journey) {
      return new HttpException({ msg: 'error' }, HttpStatus.NOT_FOUND);
    } else {

      journey.status = JourneyStatus.ARRIVED;

      journey.shipments.forEach(singleShipment => {
        singleShipment.status = ShipmentStatus.ARRIVED;
        singleShipment.save();
      });

      journey.save();


      vehicle.current = null;
      vehicle.status = Status.READY;
      vehicle.save();
      // const client: User = journey.owner;
      // journey.owner = undefined;

      //socket Later and use client ID,,,,
      console.log(journey);
      
      return journey
    }
  }

}

  // //Find All This Vehicle Journeys -- Later Make It driver Journeys
  // async findVehicleJourneys(user: User) : Promise<any> {
  //   const vehicle = await this.vehicleRepo.findOne({
  //     driver: user,
  //   });
  //   const journeys = await this.journeyRep.find({
  //     where: {
  //       vehicle: vehicle,
  //     },
  //     relations: ['origin', 'destination'],
  //   });

  //   return { journeys: journeys };
  // }

  // async findJourneysToPick(user: User) : Promise<any> {
  //   const vehicle = await this.vehicleRepo.findOne({
  //    where: {driver: user,},
  //     relations: ['type']
  //   });
  //   const journeys = await this.journeyRep.find({
  //     where: {
  //       type : vehicle.type,

  //       status: JourneyStatus.CONFIRMED,
  //     },
  //     relations: ['origin', 'destination'],
  //   });


  //   const testjourneys = await this.journeyRep.find({
  //     where: {
  //       status: JourneyStatus.CONFIRMED,
  //     },
  //     relations: ['origin', 'destination'],
  //   });

  //   console.log(vehicle.type);
  //   // console.log(testjourneys);
  //   // console.log(vehicle);



  //   return { journeys: journeys };
  // }

  // // Show Journey When Accepted



  // async setJourneyToVehicle(journeyUUID: string, user: User) : Promise< any> {

  //   const vehcile = user.vehicle;
  //   const journey = await this.journeyRep.findOne({ uuid: journeyUUID });

  //   journey.vehicle = vehcile;

  //   await this.journeyRep.save(journey);


  //   // broadcast To Vehcile Driver //
  //   //broadcast to journey shipments owners //

  //   return journey;

  // }
// }
