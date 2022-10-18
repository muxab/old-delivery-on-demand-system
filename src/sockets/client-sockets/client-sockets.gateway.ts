/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ClientSocketsService } from './client-sockets.service';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { Shipment } from 'src/database/shipment.entity';
import { Notification } from 'src/database/notification.entity';

@WebSocketGateway({ namespace: 'client', cors: true })
export class ClientSocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly clientSocketsService: ClientSocketsService) {}
  handleDisconnect(client: Socket) {
    this.logger.log(`client disCon ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client con to clientGate ${client.id}`);
  }
  afterInit(server: any) {
    this.logger.log('CLeintSocket ready');
    // throw new Error('Method not implemented.');
  }

  private logger: Logger = new Logger('ClientSocketsGateway');

  @WebSocketServer() server: Server;

  // @Roles(Role.CLIENT)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @SubscribeMessage('newshipment')
  newShipment(@MessageBody() shipment: Shipment) {

    this.server.emit(`newShipment-${shipment.type.type}`, shipment);
    // this.server.emit('newshipment', shipment);
    this.logger.log(`msg from boo `, shipment);
  }



  clientNotifications(@MessageBody() bId : string, notification : Notification) {
    
    this.server.emit(`notifications-${bId}`, );
    // this.server.emit('newshipment', shipment);
    this.logger.log(' client recieved notification');
  }


  sendToAccountant(@MessageBody() journey: any) {
    this.server.emit('msgToClient', journey);

    this.logger.log(`msg from ${journey.owner.name}`, journey);
  }

  @SubscribeMessage('newshipment')
  emitData(client: Socket, payload: string) {
    console.log(payload);
    
    this.server.emit('msgToClient', payload);

    this.server.on('msgToClient',(_)=> {
      console.log('sAdAtA',_);
      
    });
  }
}
