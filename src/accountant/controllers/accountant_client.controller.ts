import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantClientsService } from '../services/accountant_clients.service';


@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant-users')
export class AccountantClientController {
  constructor(private readonly accountantClientsService: AccountantClientsService) { }


  // make new accounts for Clients

  @Post('new-client')
  async newClient(@Body() data: any, @Request() req: any) {

    return await this.accountantClientsService.newClient(data,);
  }


  @Get('/show-client/:id')
  async showClient(@Param('id') id: number) {

    return await this.accountantClientsService.showClient(id,);
  }


  @Put('/ban-client/:id')
  async banClient(@Param('id') id: number) {

    return await this.accountantClientsService.banClient(id,);
  }

  @Put('/balance-client/:id')
  async balanceClient(@Param('id') id: number , @Body() body : any) {

    return await this.accountantClientsService.balanceClient(id, +body.balance);
  }


  @Post('/search-client')
  async searchClient(@Body() data: any, @Request() req: any) {
    return await this.accountantClientsService.searchClient(data,);
  }
}