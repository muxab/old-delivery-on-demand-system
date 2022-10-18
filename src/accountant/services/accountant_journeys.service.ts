import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Journey } from 'src/database/journey.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';

import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { AccountantVehicleService } from './accountant_vehicle.service';
import { UserService } from 'src/utils/auth/user/user.service';

// is all Aboout journeys Only
// comments at the end of class (jc-2)
@Injectable()
export class AccountantJourneysService {
    constructor(
        @InjectRepository(Journey) private journeysRep: Repository<Journey>,
        private vehicleService: AccountantVehicleService,
        private uerService: UserService,

    ) { }

    async getJourney(uuid: string): Promise<Journey> {

        return await this.journeysRep.findOne({
            where: {
                uuid: uuid
            },
            relations: ['driver', 'vehicle', 'accountant', 'shipments'],

        });
    }



    async setJourneyConfirmed(uuid: string, user: User): Promise<any> {

        const journey = await this.journeysRep.findOne({
            where: {
                uuid: uuid
            },
            // type is of type of the vehicle client asked for
            relations: ['type', 'accountant', 'shipments'],

        });

        journey.accountant = user;
        {
            // Broadcast Journey
            journey.status = JourneyStatus.CONFIRMED;
            // Update Journey->Shipments status to confirmed 
            // Broadcast to Client confirmation status
            const shipments = journey.shipments;
            shipments.forEach(async shi => {
                shi.status = ShipmentStatus.CONFIRMED;
                await shi.save();
            });

        }
        journey.accountant = user;


        this.journeysRep.save(journey);
        return journey;


    }


    async setJourneyArrived(uuid: string, user: User): Promise<any> {

        const journey = await this.journeysRep.findOne({
            where: {
                uuid: uuid,
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],
        });

        journey.accountant = user;
        {
            journey.status = JourneyStatus.ARRIVED;

            const shipments = journey.shipments;
            shipments.forEach(async shi => {
                shi.status = ShipmentStatus.ARRIVED;
                // brodcast to owned 
                // shi.owner -> BroadcastMessage
                await shi.save();
            });
        }
        this.journeysRep.save(journey);
        return journey;
    }


    async setJourneyDeclined(uuid: string, user: User): Promise<any> {

        const journey = await this.journeysRep.findOne({
            where: {
                uuid: uuid,
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],
        });

        journey.accountant = user;
        {
            // journey update after checking the journey
            journey.status = JourneyStatus.DECLINED;
            // Broadcast to Client rejection Reasons
            const shipments = journey.shipments;
            shipments.forEach(async shi => {
                shi.status = ShipmentStatus.DECLINED;
                await shi.save();
            });

        }
        this.journeysRep.save(journey);
        return journey;
    }

    async setJourneyCanceled(uuid: string, user: User): Promise<any> {

        const journey = await this.journeysRep.findOne({
            where: {
                uuid: uuid,
            },
            relations: ['invoices', 'owner', 'journey', 'accountant'],
        });

        journey.accountant = user;
        {
            journey.status = JourneyStatus.CANCELED;

            const shipments = journey.shipments;
            shipments.forEach(async shi => {
                shi.status = ShipmentStatus.CANCELED;
                await shi.save();
            });

            // comments below (jc-1)
        }
        this.journeysRep.save(journey);
        return journey;
    }

    // exclusive service 
    async setJourneyToVehicle(journeyUUID: string, data: any) {

        const vehcile = await this.vehicleService.findVehicle(data.vehcile_s);
        const journey = await this.journeysRep.findOne({ uuid: journeyUUID });

        journey.vehicle = vehcile;

        await this.journeysRep.save(journey);


        // broadcast To Vehcile Driver //
        //broadcast to journey shipments owners //

    }


    async getLiveJourneys() {
        return await this.journeysRep.find({
            where: {
                status: JourneyStatus.PICKING,
            }
        });
    }


    async searchJourney(query: string) {
        return await this.journeysRep.find({
            where: [
                {
                    uuid: Like(`%${query}%`),
                },
                {
                    track_no: Like(`%${query}%`),
                },
                {
                    vehicleId: Like(`%${query}%`),
                }

            ]
        });
    }


    async journeysOnRoad(query?: any) {


        if (query == null) {

            return await this.journeysRep.find({
                where: {
                    status: JourneyStatus.ON_VEHICLE,
                },
                relations: ['origin', 'destination'],

            });
        } else {
            const searched_vehicle = await this.vehicleService.findVehicle(query);
            return await this.journeysRep.find({

                where: [
                    {
                        status: JourneyStatus.ON_VEHICLE,
                        uuid: Like(`%${query}%`),
                    },
                    {
                        status: JourneyStatus.ON_VEHICLE,
                        track_no: Like(`%${query}%`),
                    },
                    {
                        status: JourneyStatus.ON_VEHICLE,
                        vehicle: searched_vehicle,
                    }
                ],
                relations: ['origin', 'destination'],
            });
        }
    }

    async journeysReady(query?: any) {


        if (query == null) {

            return await this.journeysRep.find({
                where: {
                    status: JourneyStatus.CONFIRMED,
                }
            });
        } else {
            const searched_vehicle = await this.vehicleService.findVehicle(query);
            return await this.journeysRep.find({

                where: [
                    {
                        status: JourneyStatus.ON_VEHICLE,
                        uuid: Like(`%${query}%`),
                    },
                    {
                        status: JourneyStatus.ON_VEHICLE,
                        track_no: Like(`%${query}%`),
                    },
                    {
                        status: JourneyStatus.ON_VEHICLE,
                        vehicle: searched_vehicle,
                    }
                ],
                relations: ['origin', 'destination'],
            });
        }
    }




    async searchSingleJourney(query: string) {
        return await this.journeysRep.find({
            where:
            {
                track_no: Like(`%${query}%`),
            },

            relations: ['shipments', 'vehicle', 'vehicle.driver','origin', 'destination']
        });
    }
}



/*
jc-1
Broadcast to Currnet Vehcile Driver If There .. 
that the journey Canceled and if he didn't already Leave He Might go to ready status 
If He Already Left .. he would be Back and would be A Fine to client 
If He didnt start Picking the items .. the fine will be there but will be smaller
[Fines Determined By Administration Later ];
Make Report About Journey Cancelation
journey update after checking the journey
*/


/*
jc-2
 confirmation is usualy automatic after confirming invoice and update shipment
 But This Functions is for overriding the system
 e.g : Special Client - client Paid in cash and there is need to start journey ... etc
 the same is on shipments .. special cl. and paiment in cash will make it neccessary to confirm shipment payment
 but All Cases should be covered 
 */