import {
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { DriverJourneyService } from './driver-journey.service';


@Roles(Role.DRIVER)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('driver-journey')
export class DriverJourneyController {
  constructor(private readonly driverJourneyService: DriverJourneyService) { }




  @Get('/journey/:uuid')
  async getSingleJourney(@Param('uuid') uuid: string, @Request() req: any,
  ) {
    return await this.driverJourneyService.showJourney(uuid, req.user);
  }


  @Put('/journey/:uuid/del')
  async confirmJourneyDeleiverd(
    @Param('uuid') uuid: string,
    @Request() req: any,
  ) {
    return await this.driverJourneyService.confirmJourneyDeleiverd(
      uuid,
      req.user,
    );
  }
 
  @Put('/journey/:uuid/way')
  async confirmJourneyOnWay(
    @Param('uuid') uuid: string,
    @Request() req: any,
  ) {
    return await this.driverJourneyService.confirmJourneyOnWay(
      uuid,
      req.user,
    );
  }

  // @Roles(Role.DRIVER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Get('/vehicle-journeys')
  // async getVehcileJourneys(@Request() req: any) {
  //   const user = req.user;
  //   const journeys = await this.driverJourneyService.findVehicleJourneys(user);
  //   return journeys;
  // }


  // @Roles(Role.DRIVER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Get('/journeys-to-pick')
  // async getJourneys(@Request() req: any) {
  //   const user = req.user;
  //   const journeys = await this.driverJourneyService.findJourneysToPick(user);
  //   return journeys;
  // }


  // @Roles(Role.DRIVER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Get('/journey/:uuid')
  // async acceptJourney(@Param('uuid') uuid: string, @Request() req: any,
  // ) {
  //   return await this.driverJourneyService.setJourneyToVehicle(uuid, req.user);
  // }


}
