import { Module } from '@nestjs/common';
import { GeneralSocketsService } from './general-sockets.service';
import { GeneralSocketsGateway } from './general-sockets.gateway';

@Module({
  providers: [GeneralSocketsGateway, GeneralSocketsService],
  exports: [GeneralSocketsGateway, GeneralSocketsService],
})
export class GeneralSocketsModule {}
