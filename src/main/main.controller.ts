import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('/v-types')
  async vehicleTypes() {
    return this.mainService.getVTypes();
  }
  @Get('/v-types/:type')
  async vehicleTypeSingl(@Param('type') type: string) {
    return this.mainService.getVTypeSingle(type);
  }
  //Locations All
  @Get('')
  async allLocations(@Request() req: any) {
    // add search 
    console.log(req.query);
    if(req.query == null || req.query.trim  == null ){
       console.log('em qu');
       const x : string = 'qw';
      //  x.tr
    }
    console.log(req.query.query);

    return await this.mainService.allLocations(req.query.query);
    return await this.mainService.allLocations(req.query.query);
  }

  /// [Add]  Trips All
  @Get('trip/:origin/:destination')
  async getTrip(@Param() locations: any) {
    // return locations;
    return await this.mainService.getTrip(locations);
  }

  // @Get('/loca')
  // async findLoc() {
  //   // return req.user;
  //   return await this.mainService.getLocations();
  // }

  @Post('newLocation')
  async addNewLocation(@Body() body : any) {
    return await this.mainService.newLocation(body.location);
  }

  @Get('/test-not')
  async test(@Body() data: any) {
    console.log(data);
    return await this.mainService.notif(data.destination);
  }
}
