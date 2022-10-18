import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Shipment } from 'src/database/shipment.entity';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { UserService } from 'src/utils/auth/user/user.service';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantShipmentService } from '../services/accountant_shipment.service';


@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant-shipments')
export class AccountantShipmentController {
  constructor(private readonly accountantShipmentService: AccountantShipmentService , private userService: UserService ) { }


  @Get('/show/:uuid')
  async getShipment(@Param('uuid') uuid: string, @Request() req: any) {
    return await this.accountantShipmentService.getShipment(uuid);
  }

  @Put('/accept/:uuid')
  async acceptShipment(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantShipmentService.setShipmentAccepted(uuid,req.user);
  }
  @Put('/arrived/:uuid')
  async arrivedShipment(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantShipmentService.setShipmentArrived(uuid,req.user);
  }
  
  
  @Put('/canceled/:uuid')
  async canceledShipment(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantShipmentService.setShipmentCanceled(uuid,req.user);
  }
   @Put('/decline/:uuid')
  async declieneShipment(@Param('uuid') uuid : string , @Request() req: any){
    return await this.accountantShipmentService.setShipmentDeclined(uuid,req.user);
  }

  @Post('new')
  async createNewShipment(@Body() data: any , @Request() req: any){

    const client =  await this.userService.findByUuid(data.user_uuid);

    return await this.accountantShipmentService.newShipment(data, client ,req.user);

  }


  @Get('/confirmed')
  async getConfirmedShipments(@Request() req: any) {
    
    return await this.accountantShipmentService.getConfirmed(req.query.query);
  }

  
  @Get('/onroad')
  async getOnRoadShipments(@Request() req: any) {
    return await this.accountantShipmentService.getOnRoad(req.query.query);
  }


  @Post('/search-shipment')
  async searchShipment(@Body() data : any , @Request() req: any) {
    return await this.accountantShipmentService.searchSingleShipment(data);
  }



}