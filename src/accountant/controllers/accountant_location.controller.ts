import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantLocationService } from '../services/accountant_location.service';


@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant-location')
export class AccountantLocationController {
  constructor(private readonly accountantLocationService: AccountantLocationService) { }


  // make new accounts for Clients

  @Post('new-location')
  async newLocation(@Body() data: any, @Request() req: any) {

    return await this.accountantLocationService.newLocation(data,);
  }


  @Get('/show-location/:code')
  async showLocation(@Param('code') code: string) {

    return await this.accountantLocationService.showLocation(code,);
  }



  @Post('new-Trip')
  async newTrip(@Body() data: any, @Request() req: any) {

    return await this.accountantLocationService.newTrip(data,);
  }


  @Put('update-Trip')
  async updateTrip(@Body() data: any, @Request() req: any) {

    return await this.accountantLocationService.updateTrip(data,);
  }

  @Get('show-trip/:dep/:arr')
  async showTrip(@Param(':dep') depatrue : string , @Param('arr') arrival : string ,){


    return await this.accountantLocationService.showTrip(depatrue , arrival);

  }




}