import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './database/location.entity';
import { User } from './database/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Location) private location: Repository<Location>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async example() {
    const user = await this.location.findOne({ city: 'dungla' });
    // user.password = undefined;

    return user;
  }
}
