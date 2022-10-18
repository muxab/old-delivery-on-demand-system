import { Body, Controller, Delete, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { DriverMainSecondService } from './driver-main-second.service';

@Roles(Role.DRIVER)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('driver-main')
export class DriverMainSecondController {
  constructor(
    private readonly driverSecondService: DriverMainSecondService,
  ) {}


  @Get('shipments')
  async showShipments(@Request() req: any){
    return await this.driverSecondService.showShipments(req.user);
  }



  @Get('find-new')
  async getJourneys(@Request() req: any) {
    return await this.driverSecondService.findShipmentToPick(req.user);
  }

  @Get('showshipment/:uuid')
  async getShipment(@Param('uuid') uuid :string , @Request() req: any) {
    return await this.driverSecondService.showShipmentToOffer(uuid);
  }

  @Post('offer/:uuid')
  async newShipmentOffer(@Param('uuid') uuid : string, @Body() data:any,@Request() req:any ){
    return await this.driverSecondService.sendOffer(uuid , data, req.user);
  }


  @Get('/myoffers')
  async myOffers(@Req() req : any ) {
    return await this.driverSecondService.myOffers(req.user);
  }
  @Get('/myoffers/offer/:uuid')
  async showOffer(@Param('uuid') uuid : string , @Req() req: any ){
    return await this.driverSecondService.showOffer(req.user , uuid);
  } 


  @Delete('/myoffers/offer/:uuid/cancel')
  async deleteOffer(@Param('uuid') uuid : string , @Req() req: any ){
    return await this.driverSecondService.deleteOffer(req.user , uuid);
  } 
}
