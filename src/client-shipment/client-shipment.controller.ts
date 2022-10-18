import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Body,
  Post,
  Req,
  Delete,
} from '@nestjs/common';
import { LocationService } from 'src/location/location.service';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { VtypeService } from 'src/vtype/vtype.service';
import { ClientShipmentSecondService } from './client-shipment-second.service';
import { ClientShipmentService } from './client-shipment.service';

@Roles(Role.CLIENT)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('client-shipment')
export class ClientShipmentController {
  constructor(
    private readonly clientShipmentService: ClientShipmentService,
    private readonly clientShipmentSecondService: ClientShipmentSecondService,
    private locationService: LocationService,
    private vtypeService: VtypeService,
  ) { }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/new')
  async create(@Body() data: any, @Request() req: any) {


    //DONE -- ADDED THE SHIPMENT
    const weight = data.weight;
    const type_s = data.type_s;
    const extra = data.extra;
    const type = data.v_type;
    const vType = await this.vtypeService.findOne(type);
    // return vType;
    const moreData = {
      weight, vType, type_s, extra, dest_address: data.dest_address,
      origin_address: data.origin_address
    };
    const dest = await this.locationService.findOne(data.destination);
    const origin = await this.locationService.findOne(data.origin);
    const user = req.user;

    // journeys created after offer accepted
    //No Need For Creating Journeys .. Journey Only Created After Vehicle accepts the shipment Delivery
    const shipment = await
      this.clientShipmentService.create(
        moreData,
        user,
        vType,
        dest,
        origin,
      );
    return { shipment: shipment };
  }




  //showing all
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/shipments')
  async getShipment(@Request() req: any) {
    //DONE .. SHOW ALL SHIPMENTS
    const user = req.user;
    return await this.clientShipmentService.showAll(user);

  }



  //DONE .. SHOW SINGLE SHIPMENT
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/shipment/:uuid')
  async getSingleJorney(@Param('uuid') uuid: string, @Request() req: any) {
    const user = req.user;
  
    return await this.clientShipmentService.show(uuid, user);
  }


  //Edit shipment before picking up
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/shipments/edit/:uuid')
  async editShipment(@Request() req: any, @Param('uuid') uuid: any, @Body() data: any) {

    
    // await this.clientShipmentService.deleteShipment(uuid, req.user);
    // return await this.create(data, req);
    return await this.clientShipmentService.editShipment(uuid , data ,req.user);

  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/shipments/cancel/:uuid')
  async delete(@Request() req: any, @Param('uuid') uuid: any,) {

    return await this.clientShipmentService.deleteShipment(uuid, req.user);
  }

  //DONE .. SHOW ALL SHIPMENT ON WAY
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/current-shipments')
  async getCurrentShipment(@Request() req: any) {

    return await this.clientShipmentService.showCurrent(req.user);

  }
  //DONE .. SHOW ALL New SHIPMENTS 
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/current-new-shipments')
  async getCurrentNewShipment(@Request() req: any) {

    return await this.clientShipmentService.showCurrentNew(req.user);

  }

  // ---- OFFERS  -- //
  //show offers off new shipments 
  @Get('shipments-offers')
  async totalNewShipmentsOffers(@Request() req: any) {

    return await this.clientShipmentSecondService.showTotalOffers(req.user);
  }

  // show offers of single shipment 
  @Get('shipment/:uuid/offers')
  async showOffers(@Param('uuid') uuid: string) {
    return await this.clientShipmentSecondService.showOffers(uuid);
  }




  //show single offer 
  @Get('/offer/:uuid')
  async showSingleOffer(@Req() req: any, @Param('uuid') uuid: string) {
    return await this.clientShipmentSecondService.showSingleOffer(uuid);
  }

  //accept single offer
  @Post('accept-offer/:uuid')
  async acceptOffer(@Param('uuid') uuid: string, @Body() body: any) {
    return await this.clientShipmentSecondService.acceptOffer(uuid);
  }


  @Delete('reject-offer/:uuid')
  async rejectOffer(@Param('uuid') uuid: string, @Body() body: any) {
    return await this.clientShipmentSecondService.rejectOffer(uuid);
  }




  //Driver And Vehicle Of Shipment 
  @Get('shipment/:uuid/shipment-dr-ve')
  async driverAndVehicle(@Param('uuid') uuid: string) {
    return await this.clientShipmentSecondService.showDetails(uuid);
  }
}




// @Roles(Role.CLIENT)
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Get('/shipments/:sort')
// async getShipmentSorted(@Request() req: any, @Param('sort') sort: string) {
//   //types of sort from shipment status ...-> ToBeAdded
//   const user = req.user;
//   return await this.clientShipmentService.showAll(user);
// }


// @Roles(Role.CLIENT)
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Post('/addToExisted')
// async addShipmentToExicetedJourney(@Body() data: any, @Request() req: any) {

//   return {
//     'hi': req.user,
//     'msg': 'add A Shipment To Existing Journey'
//   }
// }
// @Roles(Role.CLIENT)
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Post('/newMulti')
// async addMultiShipments(@Body() data: any, @Request() req: any) {

//   return {
//     'hi': req.user,
//     'msg': 'add Multi Shipments'
//   }
// }