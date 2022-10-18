import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  // @Roles(Role.DRIVER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Post('/password')
  // async editPassword(@Body() data: any, @Request() req: any) {
  //   return await this.driverService.changePass(
  //     data.password,
  //     data.newPassword,
  //     req.user,
  //   );
  // }

  // @Roles(Role.DRIVER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Post('/email')
  // async editEmail(@Body() data: any, @Request() req: any) {
  //   return await this.driverService.changeEmail(
  //     data.password,
  //     data.newEmail,
  //     req.user,
  //   );
  // }
}
