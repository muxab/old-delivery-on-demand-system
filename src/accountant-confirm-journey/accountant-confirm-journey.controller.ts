import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AccountantConfirmJourneyService } from './accountant-confirm-journey.service';

@Controller('accountant-actions')
export class AccountantConfirmJourneyController {
  constructor(private readonly aCJouService: AccountantConfirmJourneyService) {}

  @Get(':uuid')
  async JourneyDetails(@Param('uuid') uuid: string) {
    return this.aCJouService.getDetails(uuid);
  }

  @Put(':uuid')
  async updateJourney(@Param('uuid') uuid: string, @Body() data: any) {
    return this.aCJouService.updateJourney(uuid, data.status);
  }
}
