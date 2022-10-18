import { Controller, Get, Param, Put, Request, UseGuards, Res } from '@nestjs/common';
import { Invoice } from 'src/database/invoice.entity';
import { Shipment } from 'src/database/shipment.entity';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantService } from './accountant.service';


// this module about payments and invoices of clients and shipments 
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant')
export class AccountantController {
  constructor(private readonly accountantService: AccountantService) { }

  @Get('dashboard')
  async dashBoard(@Request() req: any)   : Promise<Invoice[]> {
    return await this.accountantService.dashboard();
  }

  @Get('getNewPayments')
  async newPayments(@Request() req: any)   : Promise<Invoice[]> {
    return await this.accountantService.getNewShipmentsPayments();
  }

  @Get('checkNewShipment')
  async checkNewShipments ( @Param('uuid') uuid : string , @Request() req: any) : Promise<Shipment> {
    return await this.accountantService.checkNewShipments(uuid);
  }

  @Get('payments/:uuid')
  async getPaymentsOfShipment(@Param('uuid') uuid: string, @Request() req: any,@Res() res): Promise<Shipment> {
    return res.sendFile(uuid , {root : 'uploads/invoices'});
    return await this.accountantService.getShipmentPayments(uuid);
  }


  @Put('payments/accepted/:id')
  async setInvoiceAccepted(@Param('id') id: string, @Request() req: any): Promise<any> {
    // Accept the invoice and make shipment related accepted 
    return await this.accountantService.setInvoiceAccepted(id, req.user);
  }

  @Put('payments/declined/:id')
  async setInvoiceDeclined(@Param('id') id: string, @Request() req: any): Promise<Shipment> {
    // Decline the invoice and make all shipments related declined 

    return await this.accountantService.setInvoiceDeclined(id,  req.user);
  }
}