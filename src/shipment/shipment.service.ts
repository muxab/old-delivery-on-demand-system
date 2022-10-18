import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Location } from 'src/database/location.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment) private sihpmentRepo: Repository<Shipment>,
  ) {}

  async create(
    data: any,
    user: any,
    journey: Journey,
    vtype: string | VehicleType,
    dest: Location,
    origin: Location,
  ) {
    const temp = await this.sihpmentRepo.create({
      owner: user,
      type: vtype,
      journey: journey,
      destination: dest,
      origin: origin,
      ...data,
    });

    const shipment = await this.sihpmentRepo.save(temp);
    return shipment;
  }

  async show(uuid: string, user: User) {
    const shipment = await this.sihpmentRepo.findOne({
      where: {
        owner: user,
        uuid: uuid,
      },
      relations: ['journey'],
    });
    if (!shipment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { shipment: shipment };
    // return shipment.journey.destination;
    //DONE -- RETURNS SHIPMENT AND JOURNEY DETAILS //
  }

  async showAll(user: User) {
    const shipment = await this.sihpmentRepo.find({
      where: {
        owner: user,
      },
      relations: ['journey'],
    });
    if (!shipment) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { shipment: shipment };
    // return shipment.journey.destination;
    //DONE -- RETURN ALL SHIPMENTs AND shipmentJOURNEY DETAILS //
  }
}
