import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { off } from 'process';
import { Journey } from 'src/database/journey.entity';
import { Notification } from 'src/database/notification.entity';
import { ShipmentOffer } from 'src/database/shipment-offer.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { JourneyService } from 'src/journey/journey.service';
import { DriverSocketsGateway } from 'src/sockets/driver-sockets/driver-sockets.gateway';
import { NotificationType } from 'src/utils/enums/nType.enum';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { Status } from 'src/utils/enums/vstatus.enum';
import { GloabalService } from 'src/utils/extra/global.service';
import { MoreThan, Not, Repository } from 'typeorm';

@Injectable()
export class ClientShipmentSecondService {

    constructor(
        @InjectRepository(Shipment) private shipmentRepo: Repository<Shipment>,
        @InjectRepository(Journey) private journeyRepo: Repository<Journey>,
        @InjectRepository(ShipmentOffer) private shipOfferRepo: Repository<ShipmentOffer>,
        @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
        @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
        private journeService: JourneyService,
        private uniqueId: GloabalService,
        private driverGate: DriverSocketsGateway,
    ) { }

    async showTotalOffers(user: User) {

     

        const shipments: Shipment[] = await this.shipmentRepo
            .createQueryBuilder('shipment')
            // .where("shipment.status = :sStatus" ,{sStatus :  ShipmentStatus.NEW})
            .leftJoin('shipment.owner', 'owner')
            .where('owner.id =:id', { id: user.id })
            .andWhere("shipment.status = :sStatus", { sStatus: ShipmentStatus.NEW })

            // .leftJoin('shipment.offers', 'offers')
            // .addSelect("COUNT('shipment.offers)", "count")
            // .groupBy("shipment.id")
            .loadRelationCountAndMap('shipment.newOffers', 'shipment.offers', 'offer',
                (qb) => qb.where('offer.read = false'))
            .getMany();

        return shipments;

    }



    async showOffers(uuid: string) {

        const shipment: Shipment = await this.shipmentRepo.findOne({
            where: [
                { track_no: uuid, },
                { uuid: uuid },
            ],
            relations: ['offers', 'destination', 'origin'],
        });


        return shipment;
    }


    async showSingleOffer(uuid: string) {


        const offer = await this.shipOfferRepo.findOne({
            where: [
                { uuid: uuid },
                { track_no: uuid },
            ],
            relations: ['vehicle'],
        });
        offer.read = true;
        offer.save();
        return offer;
    }




    //Accepting offer 
    // if vehicle is not ready .. or in trip 
    // tell client to check for other offers 
    async acceptOffer(uuid: string): Promise<any> {

        const offer = await this.shipOfferRepo.findOne({
            where: [
                { uuid: uuid },
                { track_no: uuid },
            ],
            relations: ['vehicle'],

        });

        if (offer == null || offer == undefined) {
            return {
                status: 404,
                msg: 'not Found',
            };
        }

        const vehicle = await this.vehicleRepo.findOne({
            where: { id: offer.vehicleId },
            relations: ['driver'],
        });

        if (vehicle.status != Status.READY) {

            offer.remove();
            return {
                'msg': 'VOS',
                //VOS => Vehicle out of service 
            }

        } else {

            //
            const shipment: Shipment = await this.shipmentRepo.findOne({
                where:
                    { id: offer.shipmentId },
                relations: ['offers',],
            });

            // If Journey is Not Existing in DB .. Create new  Record for It
            if (shipment.journeyId == null || shipment.journeyId == undefined) {

                const shipment: Shipment = await this.shipmentRepo.findOne({
                    where:
                        { id: offer.shipmentId },
                    relations: ['origin', 'destination'],
                });
                // journey Creation
                const journey = await this.journeService.createJourney(shipment.destination, shipment.destination, shipment);
                // journey Updating
                await this.journeService.updateJourney(shipment.journeyId, offer.vehicle.uuid);

            } else {
                //journey Updating Status 
                const journey = await this.journeService.updateJourney(shipment.journeyId, offer.vehicle.id);
            }

            // update shipment Status 
            shipment.status = ShipmentStatus.PICKING;
            shipment.save();

            // Sending Notification for Driver 
            const not = this.notificationRepo.create({
                user: vehicle.driver,
                message: 'تم تعيين الرحلة  لشاحنتك',
                // extra : journey.id;
                type: NotificationType.SHIPMENT,
            });
            const toSend = await this.notificationRepo.save(not);
            // Broadcasting notification on socket [canceled]
            // this.driverGate.newShipment(toSend, vehicle.driver.b_id);


            // remove other Offers 
            const toRemoveOffers = await this.shipOfferRepo.find({
                vehicle: vehicle,
                accepted: false,
                shipment: Not(shipment),
            });

            toRemoveOffers.map(async (offer) => {
                this.shipOfferRepo.delete(offer);
            })

            // after Accepting offer .. all other offers rejected .... 
            shipment.offers.map(async (offer) => {
                offer.read = true;
                offer.rejected = true;
                await offer.save();
            });
            offer.rejected = false;
            offer.accepted = true;
            offer.save();

            return {
                driver: { name: vehicle.driver.name, phone: vehicle.driver.phone },

                shipment: shipment,
            };
        }
    }


    /// [Rejecting] Offer 
    async rejectOffer(uuid: string): Promise<any> {

        const offer = await this.shipOfferRepo.findOne({
            where: [
                { uuid: uuid },
                { track_no: uuid },
            ],
            relations: ['vehicle'],

        });

        if (offer == null || offer == undefined) {
            return {
                status: 404,
                msg: 'not Found',
            };
        }

        offer.remove();
    }


    // [Details] Of Driver Of Current Shipment
    async showDetails(uuid: string) {


        const details = await this.shipmentRepo.findOne(
            {
                where: [
                    { uuid: uuid },
                    { track_no: uuid, },],

                relations: ['journey', 'journey.vehicle', 'journey.vehicle.driver'],
            }
        );

        if (details.journey == null || details.journey.vehicle == null) {
            return { error: true }
        } else {
            return {
                error: false,
                vehicle: details.journey.vehicle,
                // driver : details.journey.vehicle.driver
            }
        }
    }
}