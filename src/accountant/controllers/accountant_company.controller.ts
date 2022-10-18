import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Company } from 'src/database/company.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { AccountantCompanyService } from '../services/accountant_company.service';
import { AccountantJourneysService } from '../services/accountant_journeys.service';


@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('accountant-companies')
export class AccountantCompanyController {
  constructor(private readonly accountantCompanyService: AccountantCompanyService) { }

 // make new company accounts

 @Post('/new')
 async newCompany(@Body() body : any , @Request() req : any) : Promise<Company> {

  return await this.accountantCompanyService.newCompany(body);
 }

 @Post('/new')
 async newCompanyVehcile(@Body() body : any , @Request() req : any) : Promise<Vehicle> {

  return await this.accountantCompanyService.newVehicle(body);
 }

}