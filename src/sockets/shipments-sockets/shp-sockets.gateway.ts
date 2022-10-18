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
import { ShipmentsSocketsService } from './shp-sockets.service';
import { Shipment } from 'src/database/shipment.entity';


@WebSocketGateway({ namespace: 'shipment', cors: true })
export class ShipmentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly  shipmentSocketService : ShipmentsSocketsService) {}

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

  // @Roles(Role.DRIVER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  newShipment(@MessageBody() shipment: Shipment, type : any) {
    this.server.emit(`newShipment-${type}`, shipment);
    // this.server.emit('newshipment', shipment);
    this.server.on(`newShipment-${type}`, (shipment)=>{
      console.log('this is the broadcasted shiiiiii');
      
    });

    // this.logger.log(`new SHipment of Type ${type.type} `, shipment);
  }
  
  @SubscribeMessage('general')
  rec(@MessageBody() ss: any) {
    this.server.on('newShipment-container', ss);
    this.logger.log(`وصلت حاجة`);
  }

  testNot(@MessageBody() data: any) {
    this.server.emit('/test', data);
    this.logger.log('test Complete', data);
  }
}
