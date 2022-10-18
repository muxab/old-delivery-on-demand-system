import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/database/location.entity';
import { Trip } from 'src/database/trip.entity';
import { LocationService } from 'src/location/location.service';
import { Repository } from 'typeorm';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepo: Repository<Trip>,
    private locationService: LocationService,
  ) {}

  async findByCode(origin: any, dest: any) {
    const depart = await this.locationService.findOne(origin);
    const arrive = await this.locationService.findOne(dest);

    const trip = await this.tripRepo.findOne({
      where: {
        departure: depart,
        arrival: arrive,
      },
    });
    if(!trip){
      
    throw new   HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return trip;
  }

  async find(origin: Location, dest: Location) {
    const trip = await this.tripRepo.findOne({
      where: {
        departure: origin,
        arrival: dest,
      },
    });
    return trip;
  }

  async pricing(origin: string, dest: string) {
    const depart = await this.locationService.findOne(origin);
    const arrive = await this.locationService.findOne(dest);

    const trip = await this.tripRepo.findOne({
      where: {
        departure: depart,
        arrival: arrive,
      },
    });
    return trip.price;
  }

  async create(data) {
    const price = data.price;
    const dest = data.dest;
    const origin = data.origin;

    const temp = this.tripRepo.create({
      price: price,
      departure: origin,
      arrival: dest,
    });
    const trip = await this.tripRepo.save(temp);

    return { trip: trip };
  }

  async getAllTrips() {
    const trips = await this.tripRepo.find();
    return { trips: trips };
  }
}
