import { Controller, Get, Request, UseGuards, Param, Req, Delete, Put, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { GloabalService } from 'src/utils/extra/global.service';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { UserNotificationService } from './user-notification.service';

@Controller('notifications')
export class UserNotificationController {
  constructor(
    private readonly userNotificationService: UserNotificationService,
    private readonly testSe: GloabalService,
  ) {}

  @Roles(Role.CLIENT,Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async getNotifications(@Request() req: any) {
    return await this.userNotificationService.getAll(req.user);
  }

  @Roles(Role.CLIENT,Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('read/:uuid')
  async makeNotifications(@Param('uuid') uuid: string ,@Request() req: any) {
    return await this.userNotificationService.get(uuid,req.user);
  }


  @Roles(Role.CLIENT,Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/delete/:uuid')
  async deleteNotification(@Param('uuid') uuid: any ,@Request() req: any) {
    return await this.userNotificationService.delete(uuid ,req.user);
  }

  @Roles(Role.CLIENT,Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/seen/:uuid')
  async seenNotification(@Param('uuid') uuid: any ,@Request() req: any) {
    return await this.userNotificationService.seen(uuid ,req.user);
  }


   //for testing only  
   @Roles(Role.CLIENT,Role.DRIVER)
   @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/main')
  async mainData(@Req() req: any) {

    // get shipments where offers  
    // return req.user;
    return this.userNotificationService.getCounters(req.user);

    // get notifications count
  }
}
