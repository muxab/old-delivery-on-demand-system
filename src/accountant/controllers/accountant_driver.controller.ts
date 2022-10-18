import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantDriversService } from '../services/accountant_drivers.service';


@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant-drivers')
export class AccountantDriverController {
  constructor(
    private readonly accountantDriversService: AccountantDriversService,
    ) { }

 // make new accounts for Drivers 
 @Post('new-driver')
 async newDriver(@Body() data: any, @Request() req: any) {

   return await this.accountantDriversService.newDriver(data,);
 }


 @Get('/show-driver/:id')
 async showDriver(@Param('id') id: number) {

   return await this.accountantDriversService.showDriver(id,);
 }


 @Put('/ban-driver/:id')
 async banDriver(@Param('id') id: number) {

   return await this.accountantDriversService.banDriver(id,);
 }
}