import { Body, Controller, Get, HttpCode, HttpException, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { TripService } from './trip.service';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('/search')
  async search(@Body() data: any) {

    
    const trip = await this.tripService.findByCode(data.origin, data.destination);
  
    return trip;
    // return { trip: trip };
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/new')
  async createTrip(@Body() data: any) {
    //later make dto
    return await this.tripService.create(data);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/all')
  async getAll() {
    return await this.tripService.getAllTrips();
  }
}
