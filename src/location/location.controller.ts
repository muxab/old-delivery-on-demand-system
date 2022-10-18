import { Body, Controller, Post } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('')
  get(@Body() data: any) {
    return this.locationService.findOne(data.code);
  }
}
