import { Logger, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from 'src/database/notification.entity';
import { Shipment } from 'src/database/shipment.entity';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { DriverSocketsService } from './driver-sockets.service';

@WebSocketGateway({namespace : 'drivers' , cors : true})
export class DriverSocketsGateway {
  constructor(private readonly driverSocketsService: DriverSocketsService) {}


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

  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  newShipment(@MessageBody() notification: Notification, uuid : string) {
    this.server.emit(`driver-${uuid}`, notification);
  }
  
  generalBrodacastToDrivers(@MessageBody() msg: any) {
    this.server.on('general', msg);
  }

}
