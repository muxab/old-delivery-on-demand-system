import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/database/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private locationRepo: Repository<Location>,
  ) {}

  async findOne(name: string) {
    const location = await this.locationRepo.findOne({ 
      where: [
        {id : name},
        { code : name },
        { city : name },
        { city_en : name},
      ]
     });
    return location;
  }
}
