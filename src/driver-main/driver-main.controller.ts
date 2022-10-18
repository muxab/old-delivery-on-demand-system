import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { DriverMainSecondService } from './driver-main-second.service';
import { DriverMainService } from './driver-main.service';

@Controller('driver-main')
export class DriverMainController {
  constructor(
    private readonly driverMainService: DriverMainService,
    private readonly driverSecondService: DriverMainSecondService,
  ) {}

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('')
  async getJourneys(@Request() req: any) {
    return await this.driverMainService.vehicleData(req.user);
  }

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('update-v-status')
  async updateVStatus(@Request() req: any , @Body() body : any) {
    return await this.driverMainService.updateVStatus(req.user , body.status);
  }


  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/journeys')
  async main(@Request() req: any) {
    return await this.driverMainService.getDriverJourneys(req.user);
  }

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('journey/:uuid')
  async getJourneyDetails(@Request() req: any, @Param('uuid') uuid: string) {
    return await this.driverMainService.journeyDetails(uuid, req.user);
  }

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('accept/:uuid')
  async acceptJourney(@Request() req: any, @Param('uuid') uuid: string) {
    return await this.driverMainService.acceptJourney(uuid, req.user);
  }

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('arrived/:uuid')
  async arrivedJourney(@Request() req: any, @Param('uuid') uuid: string) {
    return await this.driverMainService.updateJourney(uuid, req.user);
  }

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('pick/:uuid')
  async pickJourney(@Request() req: any, @Param('uuid') uuid: string) {
    return await this.driverMainService.pickJourney(uuid, req.user);
  }

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('current/:uuid')
  async getCurrentJourney(@Param('uuid') uuid: string, @Request() req: any) {
    return await this.driverMainService.currentJourney(uuid, req.user);
  }
}
