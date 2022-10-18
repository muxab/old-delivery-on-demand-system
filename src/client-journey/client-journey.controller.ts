import {
  Body,
  Request,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocationService } from 'src/location/location.service';
import { ShipmentService } from 'src/shipment/shipment.service';
import { ClientSocketsGateway } from 'src/sockets/client-sockets/client-sockets.gateway';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { VtypeService } from 'src/vtype/vtype.service';
import { ClientJourneyService } from './client-journey.service';

@Controller('client-journey')
export class ClientJourneyController {
  constructor(
    private readonly clientJourneyService: ClientJourneyService,
    private locationService: LocationService,
    private shipmentService: ShipmentService,
    private vtypeService: VtypeService,
    private socket: ClientSocketsGateway,
  ) {}

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/new')
  async create(@Body() data: any, @Request() req: any) {
    //DONE -- ADDED THE JOURNEY
    const weight = data.weight;
    const type_s = data.type_s;
    const extra = data.extra;
    const type = data.type;
    const vType = await this.vtypeService.findOne(type);
    // return vType;
    const shpt = { weight, vType, type_s, extra };
    const dest = await this.locationService.findOne(data.destination);
    const origin = await this.locationService.findOne(data.origin);
    const user = req.user;

    // return { user, dest, origin };
    const journey = await this.clientJourneyService.create(
      data,
      user,
      dest,
      origin,
    );
    const shipt = await this.shipmentService.create(
      shpt,
      user,
      journey,
      vType,
      dest,
      origin,
    );
    return { journey: journey, shipt: shipt };
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/journeys')
  async getJourneys(@Request() req: any) {
    const user = req.user;
    const journeys = await this.clientJourneyService.findJourneys(user);
    return journeys;
  }

  // @Roles(Role.CLIENT)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/journey/:uuid')
  async getSingleJorney(@Param('uuid') uuid: string, @Request() req: any) {
    const user = req.user;
    return await this.clientJourneyService.showJourney(uuid, user);
  }
  // @Roles(Role.CLIENT)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './images',
    }),
  )
  @Post('/payment')
  async paymenInvoice(@UploadedFile('file') file: Express.Multer.File) {
    // console.log(file.originalname);
    return await this.clientJourneyService.payment(file);
  }
}
