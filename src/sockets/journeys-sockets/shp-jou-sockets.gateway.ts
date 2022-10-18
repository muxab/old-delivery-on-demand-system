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
import { JourneySocketsService } from './shp-jou-sockets.service';

@WebSocketGateway({ namespace: 'shipments-journeys', cors: true })
export class JourneysGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly  journeysSocketService : JourneySocketsService) {}

  private logger: Logger = new Logger('ClientSocketsGateway');
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    this.logger.log('GeneralSocket broadcast');
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client con ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`client Discon ${client.id}`);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  sendToVehicles(@MessageBody() journey: any, type: any) {
    this.server.emit(`vehicles-${type.type}`, journey);
  }
  @SubscribeMessage('general')
  rec(@MessageBody() ss: any) {
    this.server.on('vehicles-flat', ss);
    this.logger.log(`وصلت حاجة`);
  }

  testNot(@MessageBody() data: any) {
    this.server.emit('/test', data);
    this.logger.log('test Complete', data);
  }
}
