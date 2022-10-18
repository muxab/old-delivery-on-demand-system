/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';

@WebSocketGateway({ namespace: 'accountant', cors: true })
export class AccountantSocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  private logger: Logger = new Logger('Accountant SocketsGateway');
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    this.logger.log('Accountant  broadcast is Ready ');
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Accountant  con ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Accountant  Discon ${client.id}`);
  }

  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  sendToVehicles(@MessageBody() journey: any, type: any) {
    this.server.emit(`vehicles-${type.type}`, journey);
  }
  @SubscribeMessage('payment')
  rec(@MessageBody() ss: any) {
    this.server.on('new-payment', ss);
    this.logger.log(`وصلت حاجة`);
  }

  testNot(@MessageBody() data: any) {
    this.server.emit('/test', data);
    this.logger.log('test Complete', data);
  }
}
