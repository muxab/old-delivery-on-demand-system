import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from 'src/database/journey.entity';
import { Location } from 'src/database/location.entity';
import { Trip } from 'src/database/trip.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { GeneralSocketsGateway } from 'src/sockets/general-sockets/general-sockets.gateway';
import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MainService {

  constructor(
    @InjectRepository(Location) private locationRepo: Repository<Location>,
    @InjectRepository(Journey) private journeyRepo: Repository<Journey>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleType) private vTypeRepo: Repository<VehicleType>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    private genGate: GeneralSocketsGateway,
  ) {}
  async allLocations(query? : string) {
    // console.log(query);
    
    if(query == null ||  query.trim  == null  ){
      const locations = await this.locationRepo.find();
    return { locations: locations };
    }else {
      const locations = await this.locationRepo.find({
        where: [
          { code : Like(`%${query}%`), },
          { city : Like(`%${query}%`), },
          { city_en : Like(`%${query}%`),}
        ]
      });
    return { locations: locations };
    }
  }

  //check trip details and prices
  async getTrip(locations: any) {
    const origin = await this.locationRepo.findOne({ city: locations.origin });
    const destination = await this.locationRepo.findOne({
      city: locations.destination,
    });

    const trip = await this.tripRepo.findOne({
      arrival: destination,
      departure: origin,
    });
    if (!trip) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return { trip: trip };
  }

  async journeyDriver(uuid: string, user: any) {
    const vehicle = await this.vehicleRepo.findOne({ driver: user });
    const journey = await this.journeyRepo.findOne({
      where: {
        vehicle: vehicle,
        status: JourneyStatus.ON_VEHICLE,
        // uuid: uuid,
      },
      relations: ['origin', 'destination'],
    });
    // return journey;
    // return user;
    const destination = journey.destination;
    const origin = journey.origin;
    journey.origin = undefined;
    journey.destination = undefined;
    return {
      journey: journey,
      destination: destination,
      origin: origin,
    };
  }

  async getLocations() {
    const loc = await this.locationRepo.findOne({ code: 'krt' });
    return loc;
  }

  async notif(data:any) {
    await this.genGate.testNot(data);
  }

  /// Vtypes
  async getVTypes() {
    return  await this.vTypeRepo.find();
  }
  async getVTypeSingle(type:string) {
   return await this.vTypeRepo.find({
      type: type,
    });
  }


   async newLocation(name : string): Promise<Location> {
     console.log(name);
     
     const cityName = this.locationRepo.create({
       city: name ,
     })
    return await this.locationRepo.save(cityName);
  }
}
