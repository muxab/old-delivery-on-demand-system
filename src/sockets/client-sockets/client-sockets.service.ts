import { Injectable } from '@nestjs/common';
import { ClientSocketsGateway } from './client-sockets.gateway';

@Injectable()
export class ClientSocketsService {
//   constructor(private clientSoc: ClientSocketsGateway) {}

  async broadcast(data: any) {
    // await this.clientSoc.sendToDrivers(data);
    return { s: 'sd' };
  }
}
