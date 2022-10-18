import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { notEqual } from 'assert';
import { STATUS_CODES } from 'http';
import { exit } from 'process';
import { Journey } from 'src/database/journey.entity';
import { Notification } from 'src/database/notification.entity';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { ClientSocketsGateway } from 'src/sockets/client-sockets/client-sockets.gateway';
import { NotificationType } from 'src/utils/enums/nType.enum';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { Status } from 'src/utils/enums/vstatus.enum';
import { In, LessThan, LessThanOrEqual, MoreThan, Not, Repository } from 'typeorm';

@Injectable()
export class DriverMainSecondService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Shipment) private shipRepo: Repository<Shipment>,
    @InjectRepository(Journey) private journeyRepo: Repository<Journey>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(ShipmentOffer) private shipOfferRep: Repository<ShipmentOffer>,
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
    private clientSocket: ClientSocketsGateway,
  ) { }


  async findShipmentToPick(user: User) {
    const myVehicle = await this.vehicleRepo.findOne({ driver: user });
    const shipments = await this.shipRepo.find({
      where: {
        journey: null,
        type: myVehicle,
        status: ShipmentStatus.CONFIRMED,
      }
    });

    return {
      shipments: shipments
    }
  }


  //
  async showShipments(user: any) {
    const vehicle: Vehicle = await this.vehicleRepo.findOne({
      where: { driver: user, },
      relations: ['type', 'offers'],
    });

    if (vehicle == null || vehicle == undefined || vehicle.status == Status.OUT_SER) {
      return [];
    }

    const tempShipments: Shipment[] = await this.shipRepo.find({
      where: {
        type: vehicle.type,
        status: ShipmentStatus.NEW,
        weight: LessThanOrEqual(vehicle.max_load),
        // offers: In(vehicle.offers),
      },
      relations: ['destination', 'origin', 'type', 'offers'],
    });


    var me = [];
    for (var shi of tempShipments) {

      const offerExist = await this.shipOfferRep.find({
        where: {
          shipment: shi,
          vehicle: vehicle,
        }
      });
      console.log(offerExist);

      if (offerExist.length < 1) {
        me.push(shi);
      }

    }
    return me;
  }


  //
  async showShipmentToOffer(uuid: string) {
    const shipment: Shipment = await this.shipRepo.findOne({
      where: [
        { uuid: uuid },
        { track_no: uuid },
      ],
      relations: ['origin', 'destination', 'type'],
    });
    return shipment;
  }

  //
  async sendOffer(uuid: string, data: any, driver: User) {

    console.log(data.amount);

    const shipment: Shipment = await this.shipRepo.findOne({
      where: [
        { uuid: uuid },
        { track_no: uuid },
      ],
      relations: ['owner', 'destination', 'origin', 'offers'],
    });

    const offerVehicle: Vehicle = await this.vehicleRepo.findOne({
      where: {
        driver: driver,
      }
    });

    const matchCheck = await this.shipOfferRep.find({
      where: {
        shipment: shipment,
        vehicle: offerVehicle,
      },
    });

    if (matchCheck.length > 0) {
      // if there an offer from this vehicle to  this shipment .. stop him from adding new

      return new HttpException({ msg: 'duplicate' }, HttpStatus.NOT_ACCEPTABLE);

      console.log('he Cant Do It Again');

    } else {
      // allow to add an offer
      const shipOfferTem: ShipmentOffer = this.shipOfferRep.create({
        track_no: shipment.track_no,
        amount: data.amount,
        destination: shipment.destination,
        origin: shipment.origin,
        vehicle: offerVehicle,
        shipment: shipment,
      });


      const newNotif = await this.notificationRepo.save({
        message: 'لديك عرض جديد على شحنة',
        type: NotificationType.OFFER,
        user: shipment.owner,
      });




      const shOf: ShipmentOffer = await this.shipOfferRep.save(shipOfferTem);
      console.log('owner BID and Now Broadcasting ', shipment.owner.b_id);
      this.clientSocket.clientNotifications(shipment.owner.b_id, newNotif);



      shOf.destination = undefined;
      shOf.origin = undefined;
      shOf.shipment = undefined;

      // return shOf;
      return new HttpException({ msg: 'success' }, HttpStatus.CREATED);

    }
  }


  /// driver offers




  async myOffers(user: any) {
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        driver: user,
      }
    });

    const offers = await this.shipOfferRep.find({
      where: {
        vehicle: vehicle,
        rejected: false,
        accepted: false,
      },
      relations: ['origin', 'destination'],
    });

    if (offers == null || offers == undefined || offers.length < 1) {
      throw new HttpException('not Found', HttpStatus.NOT_FOUND);
    } else {
      return offers;
    }
  }


  async showOffer(user: any, uuid: string) {
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        driver: user,
      }
    });
    const offer = await this.shipOfferRep.findOne({
      where: [
        { uuid: uuid, vehicle: vehicle },
        { track_no: uuid, vehicle: vehicle },
      ],
      relations: ['origin', 'destination'],
    });



    if (offer == null || offer == undefined) {
      throw new HttpException('not Found', HttpStatus.NOT_FOUND);
    } else {

      return offer;
    }
  }


  async deleteOffer(user: any, uuid: string) {
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        driver: user,
      }
    });
    const offer = await this.shipOfferRep.findOne({
      where: [
        { uuid: uuid, vehicle: vehicle },
        { track_no: uuid, vehicle: vehicle },
      ],
      relations: ['origin', 'destination'],
    });

    offer.remove();
  }


}
