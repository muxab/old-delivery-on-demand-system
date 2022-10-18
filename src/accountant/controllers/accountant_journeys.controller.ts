import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { query } from 'express';
import { Journey } from 'src/database/journey.entity';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantJourneysService } from '../services/accountant_journeys.service';


@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant-journeys')
export class AccountantJourneysController {
  constructor(private readonly accountantJourneysService:AccountantJourneysService) { }


  // See Journey Details Before Making an action 
  @Get('journey/:uuid')
  async getJourney(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantJourneysService.getJourney(uuid);
  }


  @Put('journey/accept/:uuid')
  async acceptJourney(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantJourneysService.setJourneyConfirmed(uuid,req.user);
  }

  @Put('journey/arrived/:uuid')
  async arrivedJourney(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantJourneysService.setJourneyArrived(uuid,req.user);
  }


  @Put('journey/canceled/:uuid')
  async cancelJourney(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantJourneysService.setJourneyCanceled(uuid,req.user);
  }
  @Put('journey/decline/:uuid')
  async declieneJourney(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantJourneysService.setJourneyDeclined(uuid,req.user);
  }


  // Get journeys => on Way now 

  @Get('/pick')
  async getLiveJourneys(@Request() req: any){
    return await this.accountantJourneysService.getLiveJourneys();
  }
  @Get('/road')
  async journeysOnRoad(@Request() req: any ) : Promise<Journey[]> {
    return await this.accountantJourneysService.journeysOnRoad(req.query.query);
  }

  @Get('/ready')
  async journeysReady(@Request() req: any ) : Promise<Journey[]> {
    return await this.accountantJourneysService.journeysReady(req.query.query);
  }
  // Searching JOurneys
  @Post('/search')
  async searchJourney(@Body() body:any) {
    return await this.accountantJourneysService.searchJourney(body.query);
  }

  @Post('/search-journey')
  async searchSingleJourney(@Body() body:any) {
    return await this.accountantJourneysService.searchSingleJourney(body.query);
  }


 
}