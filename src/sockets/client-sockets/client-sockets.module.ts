import { Module } from '@nestjs/common';
import { ClientSocketsService } from './client-sockets.service';
import { ClientSocketsGateway } from './client-sockets.gateway';

@Module({
  providers: [ClientSocketsGateway, ClientSocketsService],
  exports: [ClientSocketsGateway, ClientSocketsService],
})
export class ClientSocketsModule {}
