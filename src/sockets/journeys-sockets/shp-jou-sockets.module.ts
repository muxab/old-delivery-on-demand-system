import { Module } from '@nestjs/common';
import { JourneysGateway } from './shp-jou-sockets.gateway';
import { JourneySocketsService } from './shp-jou-sockets.service';

@Module({
  providers: [JourneysGateway, JourneySocketsService],
  exports: [JourneysGateway, JourneySocketsService],
})
export class JourneysSocketsModule {}
