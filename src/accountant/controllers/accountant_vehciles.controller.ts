import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Vehicle } from 'src/database/vehicle.entity';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { UserService } from 'src/utils/auth/user/user.service';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantJourneysService } from '../services/accountant_journeys.service';
import { AccountantVehicleService } from '../services/accountant_vehicle.service';


@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant-vehicles')
export class AccountantVehiclesController {
  constructor(private readonly accountantVehicleService: AccountantVehicleService, private userService: UserService) { }


  // make new vehicles accounts

  @Post('/new')
  async newVehicle(@Body() body: any, @Request() req: any): Promise<Vehicle> {

    const driver = await this.userService.findByUuid(body.driver_uuid);

    return await this.accountantVehicleService.newVehicle(body, driver);
  }

  @Get('/show/:search_v')
  async showVehicle(@Param('search_v') search_v: string, @Request() req: any): Promise<Vehicle> {

    return await this.accountantVehicleService.findVehicle(search_v);
  }


  @Get('/show/:search_v')
  async showManyVehicles(@Param('search_v') search_v: string, @Request() req: any): Promise<Vehicle[]> {

    return await this.accountantVehicleService.findManyVehicles(search_v);
  }

  @Post('/search-vehicle/')
  async searchVehicle( @Request() req: any , @Body() data : any): Promise<Vehicle> {

    return await this.accountantVehicleService.findVehicle(data);
  }


  @Get('/free')
  async getFreeV(@Request() req: any, @Body() data: any): Promise<Vehicle[]> {
    
    return await this.accountantVehicleService.freeVehicles();
  }

  @Get('/road')
  async getOnRoadV(@Request() req: any, @Body() data: any): Promise<Vehicle[]> {
    
    return await this.accountantVehicleService.roadVehicles();
  }


  @Get('/searchFree')
  async searchFreeV(@Request() req: any, @Body() data: any): Promise<Vehicle[]> {
    
    return await this.accountantVehicleService.searchfreeVehicles(req.query.query);
  }

  @Get('/searchRoad')
  async searchOnRoadV(@Request() req: any, @Body() data: any): Promise<Vehicle[]> {
    
    return await this.accountantVehicleService.searchroadVehicles(req.query.query);
  }



  @Get('/types')
  async vehicleTypes(@Request() req: any) {
    return await this.accountantVehicleService.getTypes();
  }

  @Post('/new-type')
  async newVType(@Request() req: any, @Body() body: any) {
    return await this.accountantVehicleService.newVType(body);
  }
}