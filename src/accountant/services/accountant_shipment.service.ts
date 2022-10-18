import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientShipmentService } from 'src/client-shipment/client-shipment.service';
import { Invoice } from 'src/database/invoice.entity';
import { Location } from 'src/database/location.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { ShipmentPayment } from 'src/utils/enums/spayment.enum';
import { Like, Repository } from 'typeorm';
import { AccountantVehicleService } from './accountant_vehicle.service';

/// This class IS All About shipments status  no more 
// there is comments in end of class (jc-1)
@Injectable()
export class AccountantShipmentService {

    constructor(
        @InjectRepository(Invoice) private invoicesRep: Repository<Invoice>,
        @InjectRepository(Shipment) private shipmentsRep: Repository<Shipment>,
        @InjectRepository(VehicleType) private vTypeRep: Repository<VehicleType>,
        @InjectRepository(Location) private locationRepo: Repository<Location>,
        private clientShipmentService: ClientShipmentService,
        private vehicleService : AccountantVehicleService,

    ) { }



    async newShipment(data: any, client: User, accountant: User): Promise<Shipment> {

        const vType = await this.vTypeRep.findOne({ type: data.v_type });
        const destination = await this.locationRepo.findOne({ code: data.dest_code });
        const origin = await this.locationRepo.findOne({ code: data.orig_code });

        return await this.clientShipmentService.create(data, client, vType, destination, origin);

    }


    async getShipment(uuid: string): Promise<Shipment> {

        return await this.shipmentsRep.findOne({
            where: {
                uuid: uuid
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],
        });
    }


    async searchShipment(query: string) {
        return await this.shipmentsRep.find({
            where: [
                {
                    uuid: Like(`%${query}%`),
                },
                {
                    track_no: Like(`%${query}%`),
                },

            ]
        });
    }



    async setShipmentAccepted(uuid: string, user: User): Promise<any> {
        const shipment = await this.shipmentsRep.findOne({
            where: {
                uuid: uuid
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],

        });

        shipment.accountant = user;
        {
            // shipment update after checking the shipment -- payment
            shipment.status = ShipmentStatus.CONFIRMED;
        }

        this.shipmentsRep.save(shipment);
        this.shipmentsRep.save(shipment);
        return { shipment };


    }


    async setShipmentArrived(uuid: string, user: User): Promise<any> {
        const shipment = await this.shipmentsRep.findOne({
            where: {
                uuid: uuid
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],

        });

        shipment.accountant = user;
        {
            // shipment update after checking the shipment -- payment
            shipment.status = ShipmentStatus.ARRIVED;
        }

        this.shipmentsRep.save(shipment);
        this.shipmentsRep.save(shipment);
        return { shipment };


    }
    async setShipmentCanceled(uuid: string, user: User): Promise<any> {

        const shipment = await this.shipmentsRep.findOne({
            where: {
                uuid: uuid,
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],
        });

        shipment.accountant = user;
        {
            // shipment update after checking the shipment
            shipment.status = ShipmentStatus.CANCELED;
        }
        this.shipmentsRep.save(shipment);
        return { shipment };
    }

    async setShipmentDeclined(uuid: string, user: User): Promise<any> {

        const shipment = await this.shipmentsRep.findOne({
            where: {
                uuid: uuid,
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],
        });

        shipment.accountant = user;
        {
            // shipment update after checking the shipment
            shipment.status = ShipmentStatus.DECLINED;
        }
        this.shipmentsRep.save(shipment);
        return { shipment };
    }



    /// 

    async getOnRoad(query?: string) {
        if (query == null) {

            return await this.shipmentsRep.find({
                where: {
                    status: ShipmentStatus.ON_VEHICLE,
                },
                relations: ['origin','destination']
            })
        } else {
            const vehicle = await this.vehicleService.findVehicle(query);
            return await this.shipmentsRep.find({
                where: [
                    { status: ShipmentStatus.ON_VEHICLE,
                        uuid : Like(`%${query}%`)
                    },
                    { status: ShipmentStatus.ON_VEHICLE,
                        track_no : Like(`%${query}%`)
                    },
                
                ],
                relations: ['origin','destination']
            })
        }
    }

    async getConfirmed(query?: string) {
        if (query == null) {

            return await this.shipmentsRep.find({
                where: {
                    status: ShipmentStatus.NEW,
                },
                relations: ['origin', 'destination']
            })
        } else {
            return await this.shipmentsRep.find({
                where: [

                    { status: ShipmentStatus.CONFIRMED,
                        uuid : Like(`%${query}%`)
                    },
                    { status: ShipmentStatus.CONFIRMED,
                        track_no : Like(`%${query}%`)
                    }, 
                ],
                relations: ['origin', 'destination']
            })
        }
    }

     async getNew(query?: string) {
        if (query == null) {

            return await this.shipmentsRep.find({
                where: {
                    status: ShipmentStatus.NEW,
                },
                relations: ['client', 'invoices'],
            })
        } else {
            return await this.shipmentsRep.find({
                where: [

                    { status: ShipmentStatus.NEW,
                        uuid : Like(`%${query}%`)
                    },
                    { status: ShipmentStatus.NEW,
                        track_no : Like(`%${query}%`)
                    },
                  
                ]
            })
        }
    }





    async searchSingleShipment(data: any) {
        return await this.shipmentsRep.findOne({
            where : {
                track_no : Like(`%${data.query}%`)
            },
            relations : ['journey','owner','origin', 'destination'],
        })
    }

}

/*
jc-1
confirmation is usualy automatic after confirming invoice and update shipment
 But This Functions is for overriding the system 
 e.g : Special Client - client Paid in cash and there is need to start journey ... etc 
 the same is on shipments .. special cl. and paiment in cash will make it neccessary to confirm shipment payment


 but All Cases should be covered */