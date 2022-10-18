import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/database/invoice.entity';
import { Journey } from 'src/database/journey.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { ShipmentPayment } from 'src/utils/enums/spayment.enum';
import { Like, Repository } from 'typeorm';



/// This class IS All About payments and invoices no more 
@Injectable()
export class AccountantService {
    constructor(
        @InjectRepository(Invoice) private invoicesRep: Repository<Invoice>,
        @InjectRepository(Shipment) private shipmentsRep: Repository<Shipment>,
        @InjectRepository(Journey) private journeysRep: Repository<Journey>,
    ) { }

    async dashboard(): Promise<any> {
        const journeys_pick_count = await this.journeysRep.count({
            where: {
                status: JourneyStatus.PICKING,
            }
        });
        const journeys_onvehicle_count = await this.journeysRep.count({
            where: {
                status: JourneyStatus.ON_VEHICLE,
            }
        });
        const journeys_ready_count = await this.journeysRep.count({
            where: {
                status: JourneyStatus.NEW,
            }
        });

        const shipment_pick_count = await this.shipmentsRep.count({
            where: {
                status: ShipmentStatus.PICKING,
            }
        });
        const shipment_onvehicle_count = await this.shipmentsRep.count({
            where: {
                status: ShipmentStatus.ON_VEHICLE,
            }
        });
        const shipment_ready_count = await this.shipmentsRep.count({
            where: {
                status: ShipmentStatus.NEW,
            }
        });



        return {
            shipments: {
                new: shipment_ready_count,
                picking: shipment_pick_count,
                onvehicle: shipment_onvehicle_count,
            },
            journeys: {
                new: journeys_ready_count,
                picking: journeys_pick_count,
                onvehicle: journeys_onvehicle_count,
            }
        }


    }


    async getNewShipmentsPayments(): Promise<Invoice[]> {

        return await this.invoicesRep.find({
            where:
                [
                    { status: ShipmentPayment.NEW },
                    { status: ShipmentPayment.CHECK }
                ]
            ,
            relations: ['shipment', 'client'],
        });
    }

    async checkNewShipments(uuid: string): Promise<Shipment> {

        const shipment = await this.shipmentsRep.findOne({
            where:
            {
                uuid: uuid
            }
            ,
            relations: ['client', 'invoice'],
        });

        shipment.payment = ShipmentPayment.CHECK;
        return await this.shipmentsRep.save(shipment);

    }

    async getShipmentPayments(uuid: string): Promise<Shipment> {

        const shipment = await this.shipmentsRep.findOne({
            where:
            {
                uuid: uuid,
            }
            ,
            relations: ['invoices', 'owner'],
        });

        return shipment;
    }


    async setInvoiceAccepted(id: string, user: User): Promise<any> {
        const invoice = await this.invoicesRep.findOne({
            where: {
                id: id
            },
            relations: ['accountant', 'shipment'],

        });

        invoice.accountant = user;
        {
            // shipment update after checking the invoice
            invoice.status = ShipmentPayment.YES;
            invoice.shipment.payment = ShipmentPayment.YES;
        }

        this.invoicesRep.save(invoice);
        this.shipmentsRep.save(invoice.shipment);
        return { invoice };


    }
    async setInvoiceDeclined(id: string, user: User): Promise<any> {

        const invoice = await this.invoicesRep.findOne({
            where: {
                id: id,
            },
            relations: ['accountant', 'shipment'],
        });

        invoice.accountant = user;
        {
            // shipment update after checking the invoice
            invoice.status = ShipmentPayment.DECLINeD;
            invoice.shipment.payment = ShipmentPayment.DECLINeD;
        }
        this.invoicesRep.save(invoice);
        this.shipmentsRep.save(invoice.shipment);


        return { invoice };

    }

    async searchInvoice(query: string) {
        return await this.invoicesRep.find({
            where: [
                {
                    uuid: Like(`%${query}%`),
                },
                {
                    ref_no: Like(`%${query}%`),
                },

            ]
        });
    }

}
