import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/database/user.entity';
import { Company } from 'src/database/company.entity';
import { GloabalService } from 'src/utils/extra/global.service';
import { Role } from 'src/utils/roles/role.enum';
import { AccountStatus } from 'src/utils/roles/account-status.enum';
import { Location } from 'src/database/location.entity';
import { Trip } from 'src/database/trip.entity';

// is all Aboout clients
@Injectable()
export class AccountantLocationService {

    constructor(
        @InjectRepository(Location) private locationsRep: Repository<Location>,
        @InjectRepository(Trip) private tripsRep: Repository<Trip>,
        private globalService: GloabalService,
    ) { }



    async newLocation(data: any): Promise<Location> {


        const code = await this.generateLocationCode(data.city_en);
        const location_t_d = this.locationsRep.create({
            city: data.city,
            city_en: data.city_en,
            code: code,
            latitiude: data.lat,
            longitude: data.long
        });

        return await this.locationsRep.save(location_t_d);
    }


    async showLocation(code: string): Promise<Location> {
        return await this.locationsRep.findOne({ code: code });
    }

    async newTrip(data: any): Promise<Trip> {

        const departue = await this.locationsRep.findOne({ code: data.departue });
        const arrival = await this.locationsRep.findOne({ code: data.arrival });

        const trip_t_d = this.tripsRep.create({
            code: departue.code + arrival.code,
            price: data.price,
            departure: departue,
            arrival: arrival,
        });

        return await this.tripsRep.save(trip_t_d);
    }


    async showTrip(de_code: string, arr_code: string): Promise<Trip> {

        const departue = await this.locationsRep.findOne({ code: de_code });
        const arrival = await this.locationsRep.findOne({ code: arr_code });

        return await this.tripsRep.findOne({
            where: [
                { departure: departue, arrival: arrival },
                { arrival: arrival, departure: departue },
            ]
        })
    }
    updateTrip(data: any) {
        throw new Error('Method not implemented.');
    }





















    // Code - Generation
    async generateLocationCode(data: string) {

        const code = data.charAt(0) + data.charAt(1) + data.charAt(2);
        const check = await this.locationsRep.findOne({ code: code });
        if (!check) {
            return code;
        } else {
            code + data.charAt(3);
            return code;
        }
    }
}
