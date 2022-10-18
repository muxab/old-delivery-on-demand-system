import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/database/invoice.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';
import { InvoiceType } from 'src/utils/enums/invoice-type.enum';
import { ShipmentPayment } from 'src/utils/enums/spayment.enum';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Invoice) private invoiceRep: Repository<Invoice>,
        @InjectRepository(Shipment) private shipmentRep: Repository<Shipment>,
    ) { }


    async newInvoice(data: any, user: User): Promise<Invoice> {

        const shipment = await this.shipmentRep.findOne({
            where: {
                uuid: data.uuid
            }
        });

        const invoice = await  this.invoiceRep.save({
            client: user,
            status: ShipmentPayment.NEW,
            shipment: shipment,
            uuid: shipment.uuid,
            type : InvoiceType.CHEQUE,
        });

        shipment.payment = ShipmentPayment.NEW;

        shipment.save();

        return invoice;
    }

    async checkPaymentStatus(uuid: string, user: User) {

        // // return uuid;
        return await this.invoiceRep.find({
           where : {
            uuid:uuid,
            client: user,
           },
            relations: ['shipment']
        });

        

        
    }


  
}
