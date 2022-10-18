import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { read } from 'fs';
import { generate } from 'shortid';
import { Notification } from 'src/database/notification.entity';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { NotificationType } from 'src/utils/enums/nType.enum';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserNotificationService {

  constructor(
    @InjectRepository(Notification) private notificationRep: Repository<Notification>,
    // @InjectRepository(ShipmentOffer) private shipmentOffersRep: Repository<ShipmentOffer>,
    @InjectRepository(Shipment) private shipmentsRep: Repository<Shipment>,
  ) { }


  // get All notifications 
  async getAll(user: any) {
    const notifications = await this.notificationRep.find({
      where: {
        user: user,
      },
      order: {
        read: 'DESC',
      }
    });
    return notifications;
  }

  // get single Notification
  async get(uuid: string, user: User) {
    const notification = await this.notificationRep.findOne({
      where: {
        user: user,
        uuid: uuid
      },
    });
    notification.read = true;
    notification.save();
    return notification;
  }



  // counter of offers and new notifications
  async getCounters(user: User) {
    const notif = await this.notificationRep.count({
      where: {
        user: user,
        read: false,
      }
    });

    const offersCount = await this.shipmentsRep.createQueryBuilder('shipment')
      .where('shipment.status = :status', { status: 'new' })
      .leftJoin('shipment.owner', 'owner')
      .where('owner.id =:id', { id: user.id })
      // .loadRelationCountAndMap('shipment.owner', 'shipment.owner', 'owner',
      // (qb) => qb.where('owner.id =: id', {id : user.id}))
      .loadRelationCountAndMap('shipment.newOffers', 'shipment.offers', 'offer',
        (qb) => qb.where('offer.read = false'))
      .getCount();


    if (user.role == 'client') {
      return {
        notifications: notif,
        offers: offersCount
      }
    }
    else {
      return {
        notifications: notif,
      }
    }
  }


  async delete(uuid: number, user: any) {
    const n = await this.notificationRep.findOne({id : uuid });
    console.log(n);
    
    const notifications = await this.notificationRep.delete( {id :uuid});

  }

  
  async seen(uuid: number, user: any) {
    const n = await this.notificationRep.findOne({id : uuid , user : user });
    
    n.read = true ;
    n.save();
    
    return n;
  }
}
