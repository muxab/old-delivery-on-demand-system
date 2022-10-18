import { Module } from '@nestjs/common';
import { ShipmentsGateway } from './shp-sockets.gateway';
import { ShipmentsSocketsService } from './shp-sockets.service';

@Module({
  providers: [ShipmentsGateway, ShipmentsSocketsService],
  exports: [ShipmentsGateway, ShipmentsSocketsService],
})
export class ShipmentsSocketsModule {}
