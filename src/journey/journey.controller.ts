import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { JourneyService } from './journey.service';

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/journeys')
  async getJourneys(@Request() req: any) {
    const user = req.user;
    const journeys = await this.journeyService.findJourneys(user);
    return { journeys: journeys };
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/:uuid')
  async getSingleJorney(@Param('uuid') uuid: string, @Request() req: any) {
    const user = req.user;
    return await this.journeyService.showJourney(uuid, user);
  }
}
