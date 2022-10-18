import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VtypeService {
  constructor(
    @InjectRepository(VehicleType) private vTypeRepo: Repository<VehicleType>,
  ) { }
  async findOne(searchType: string) {
    const vtype = await this.vTypeRepo.findOne({
      where: [
        { id: searchType },
        { type: searchType },
        { type_ar: searchType, }
      ]
    });
    return vtype;
  }
}
