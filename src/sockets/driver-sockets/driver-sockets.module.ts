import { Module } from '@nestjs/common';
import { DriverSocketsService } from './driver-sockets.service';
import { DriverSocketsGateway } from './driver-sockets.gateway';

@Module({
  providers: [DriverSocketsGateway, DriverSocketsService],
  exports: [DriverSocketsGateway, DriverSocketsService],
})
export class DriverSocketsModule {}
