import { Module } from '@nestjs/common';
import { AccountantSocketsGateway } from './acc-sockets.gateway';
import { AccounantSocketsService } from './acc-sockets.service';

@Module({
  providers: [AccountantSocketsGateway, AccounantSocketsService],
  exports: [AccountantSocketsGateway, AccounantSocketsService],
})
export class AccountantSocketsModule {}
