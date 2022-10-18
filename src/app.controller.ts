import { Controller, Get, Injectable, Param, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { Shipment } from './database/shipment.entity';
import { ClientSocketsGateway } from './sockets/client-sockets/client-sockets.gateway';
import { ShipmentsGateway } from './sockets/shipments-sockets/shp-sockets.gateway';
import { JwtAuthGuard } from './utils/auth/jwt/jwt.guard';
import { ShipmentStatus } from './utils/enums/s-status.enum';
import { AccountStatus } from './utils/roles/account-status.enum';
import { Status } from './utils/roles/ban.decorator';
import { BanGuard } from './utils/roles/ban.guard';
import { Role } from './utils/roles/role.enum';
import { RoleGuard } from './utils/roles/role.guard';
import { Roles } from './utils/roles/roles.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private socket: ShipmentsGateway,
    @InjectRepository(Shipment) private sRep : Repository<Shipment>
  ) { }


  // @Roles(Role.CLIENT,Role.ADMIN,Role.DRIVER)
  // @Status(AccountStatus.ACTIVE)
  // @UseGuards(JwtAuthGuard, RoleGuard, BanGuard)
  @Get('mes/:nu')
 async getHello(@Request() req:any, @Param('nu') nu : number) {
    const sh = await this.sRep.find({where:{
      status: ShipmentStatus.NEW,
    }});
    this.socket.newShipment(sh[nu],'container');
    return sh[nu];
    return this.appService.example();

  }
}
