import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { ShipmentService } from './shipment.service';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/shipments')
  async showAllS(@Param('uuid') uuid: string, @Request() req: any) {
    const user = req.user;
    return await this.shipmentService.showAll(user);
  }

  //DONE -- SHOING THE SHIPMENT DETAILS ,
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/shipments')
  async showSDetails(@Param('uuid') uuid: string, @Request() req: any) {
    const user = req.user;
    return await this.shipmentService.show(uuid, user);
  }
}
