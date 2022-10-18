import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Location } from 'src/database/location.entity';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { JourneyService } from 'src/journey/journey.service';
import { LocationService } from 'src/location/location.service';
import { ShipmentsGateway } from 'src/sockets/shipments-sockets/shp-sockets.gateway';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { GloabalService } from 'src/utils/extra/global.service';
import { Repository } from 'typeorm';

@Injectable()
export class ClientShipmentService {

  constructor(
    @InjectRepository(Shipment) private shipmentRepo: Repository<Shipment>,
    @InjectRepository(Journey) private journeyRepo: Repository<Journey>,
    @InjectRepository(ShipmentOffer) private shipOfferRepo: Repository<ShipmentOffer>,
    private journeService: JourneyService,
    private locationService: LocationService,
    private uniqueId: GloabalService,
    private newShpGate: ShipmentsGateway,
  ) { }

  // fn() creation
  async create(
    data: any,
    user: User,
    vtype: VehicleType,
    dest: Location,
    origin: Location,
  ) {
    // trackNo Generation Method
    const trackNo = await this.generateTrackNo(
      dest.code == null ? 'unknown' : dest.code,
      origin.code == null ? 'unknown' : origin.code,
    );

    const shipment: Shipment = await this.shipmentRepo.save({
      ownerId : user.id,
      type: vtype,
      destination: dest,
      origin: origin,
      ...data,
      track_no: trackNo,
    });

    // finished making [Shipment] now Crating journey to assign shipment to

    const journey: Journey = await this.journeService.createJourney(
      dest,
      origin,
      shipment,
    );

    shipment.journey = journey;
    await this.shipmentRepo.save(shipment);

    // finished .. now broadcast to recieve offers ... 

    // 
    this.newShpGate.newShipment(shipment, vtype.id);

    return shipment;
    //
  }




  // Shipment Edition Method
  async editShipment(uuid: any, data: any, user: User) {

    const shipment = await this.shipmentRepo.findOne({
      where: [
        {
          ownerId : user.id,
          uuid: uuid,
        },
      ],
      relations: ['journey', 'origin', 'destination'],
    });
    if (!shipment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    //
    const new_origin = await this.locationService.findOne(data.origin);
    const new_dest = await this.locationService.findOne(data.destination);
    shipment.origin_address = data.origin_address;
    shipment.dest_address = data.destination_address;

    const trackNo = await this.generateTrackNo(
      new_dest.code == null ? 'unknown' : new_dest.code,
      new_origin.code == null ? 'unknown' : new_origin.code,
    );

    if (data.weight != null && data.weight != undefined && data.weight.toString().trim() != "") {
      shipment.weight = data.weight;

      await this.shipmentRepo.update(shipment.id,
        {
          ...data,
          track_no: trackNo,
          origin: new_origin,
          destination: new_dest
        });
    }

    return await this.shipmentRepo.findOne({
      where: [
        {
          ownerId : user.id,
          uuid: uuid,
        },
      ],
      relations: ['journey', 'origin', 'destination'],
    });

  }



  async show(uuid: string, user: User) {
    const shipment = await this.shipmentRepo.findOne({
      where: [
        {
          ownerId : user.id,
          uuid: uuid,
        },
        {
          ownerId : user.id,
          track_no: uuid,
        },
      ],
      relations: ['journey', 'destination', 'origin'],
    });

    if (!shipment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { shipment: shipment };
    // return shipment.journey.destination;
    //DONE -- RETURNS SHIPMENT AND JOURNEY DETAILS //
  }

  async deleteShipment(uuid: any, user: any) {
    const shipment = await this.shipmentRepo.findOne({
      where: [
        {
          ownerId: user.id,
          uuid: uuid,
        },
      ],
      relations: ['journey', 'destination', 'origin', 'offers'],
    });

    // return shipment ;
    if (shipment.journeyId != null) {
      await this.journeyRepo.delete(shipment.journeyId);
    }


    // if(shipment.offers.length > 0) {
    //   shipment.offers.
    // }
    await this.shipmentRepo.delete(shipment.id);
    return {
      success : true 
    }
  }

  async showAll(user: User) {
    const shipment = await this.shipmentRepo.find({
      where: {
        ownerId : user.id,
      },
      relations: ['destination', 'origin'],
    });
    if (!shipment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { shipments: shipment };
    // return shipment.journey.destination;
    //DONE -- RETURN ALL SHIPMENTs AND shipmentJOURNEY DETAILS //
  }

  async showCurrent(user: User) {
    const shipment = await this.shipmentRepo.find({
      where: [
        {
          ownerId : user.id,
          status: ShipmentStatus.ON_VEHICLE,
        },
        {
          ownerId : user.id,
          status: ShipmentStatus.PICKING,
        },
      ],
      relations: ['destination', 'origin'],
    });
    if (!shipment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { shipments: shipment };
    // return shipment.journey.destination;
    //DONE -- RETURN ALL SHIPMENTs AND shipmentJOURNEY DETAILS //
  }
  async showCurrentNew(user: User) {
    const shipment = await this.shipmentRepo.find({
      where: {
        ownerId : user.id,
        status: ShipmentStatus.NEW,
      },
      relations: ['destination', 'origin'],
    });
    if (!shipment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { shipments: shipment };
    // return shipment.journey.destination;
    //DONE -- RETURN ALL SHIPMENTs AND shipmentJOURNEY DETAILS //
  }

  async generateTrackNo(dest: any, origin: any) {
    const trakNo = await this.uniqueId.uniqueNumber(dest, origin);
    const result = await this.shipmentRepo.find({
      where: {
        track_no: trakNo,
      },
    });

    while (result.length > 0) {
      await this.shipmentRepo.find({
        where: {
          track_no: trakNo,
        },
      });
      return await this.uniqueId.uniqueNumber(dest, origin);
    }
    console.log(trakNo);
    return trakNo;

  }
}
