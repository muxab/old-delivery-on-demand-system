import { HttpException, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from 'src/database/company.entity';
import { CompanyType } from 'src/database/company-type.entity';
import { GloabalService } from 'src/utils/extra/global.service';
import { Role } from 'src/utils/roles/role.enum';
import { Vehicle } from 'src/database/vehicle.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { User } from 'src/database/user.entity';
import { Status } from 'src/utils/enums/vstatus.enum';
import { UserService } from 'src/utils/auth/user/user.service';
import { AnyARecord } from 'dns';

// is all Aboout clients
@Injectable()
export class AccountantVehicleService {


    constructor(
        @InjectRepository(Vehicle) private vehicleRep: Repository<Vehicle>,
        @InjectRepository(VehicleType) private vehicleTypeRep: Repository<VehicleType>,
        private userService: UserService,
    ) { }



    async newVehicle(data: any, driver: User): Promise<Vehicle> {

        const type = await this.vehicleTypeRep.findOne({
            where: {
                type: data.v_type,
            }
        });

        const vehicle_t_data = this.vehicleRep.create({
            max_load: data.max_load,
            plate_no: data.plate_no,
            liceinse_no: data.liceinse_no,
            type: type,
            type_txt: type.type,
            driver: driver
        });

        return await this.vehicleRep.save(vehicle_t_data);

    }


    async findVehicle(data: any): Promise<Vehicle | any> {

        const v = await this.vehicleRep.find({
            where:
                [
                    { liceinse_no: data.query },
                    { plate_no: data.query },
                    { uuid: data.query },
                    // { driverId: data.query },
                    { companyId: data.query },

                ],
            relations: ['current', 'driver', 'company']
        });


        return v;

    }

    async findManyVehicles(search_v: string): Promise<Vehicle[]> {

        return await this.vehicleRep.find({
            where:
                [
                    // { driverId: search_v },
                    { companyId: search_v },
                ]
        });
    }




    async freeVehicles() {


        return await this.vehicleRep.find({
            where: {
                status: Status.READY,
            },
            relations: ['driver']
        });

    }




    async roadVehicles() {


        return await this.vehicleRep.find({
            where: [
                {
                    status: Status.ON_TRIP,
                },
                {
                    status: Status.PICKING,
                }
            ],
            relations: ['driver']
        });

    }




    // Search Vehicles 


    async searchfreeVehicles(query?: any) {

        if (query == null) {

            return await this.vehicleRep.find({
                where: {
                    status: Status.READY,
                }
            });
        } else {
            const vehicles = await this.vehicleRep.find({
                where:
                    [
                        {
                            status: Status.READY,
                            plate_no: Like(`%${query}%`),
                        },
                        {
                            status: Status.READY,
                            uuid: Like(`%${query}%`),
                        },
                        {
                            status: Status.READY,
                            liceinse_no: Like(`%${query}%`),
                        },
                        {
                            status: Status.READY,
                            max_load: Like(`%${query}%`),
                        },
                    ]

            });

            return vehicles;
        }
    }




    async searchroadVehicles(query?: any) {

        if (query == null) {

            return await this.vehicleRep.find({
                where: [
                    {
                        status: Status.ON_TRIP,
                    },
                    {
                        status: Status.PICKING,
                    }
                ]
            });
        } else {
            return await this.vehicleRep.find({
                where:
                    [
                        {
                            status: Status.ON_TRIP,
                            plate_no: Like(`%${query}%`),
                        },
                        {
                            status: Status.ON_TRIP,
                            uuid: Like(`%${query}%`),
                        },
                        {
                            status: Status.ON_TRIP,
                            liceinse_no: Like(`%${query}%`),
                        },
                        {
                            status: Status.ON_TRIP,
                            max_load: Like(`%${query}%`),
                        },
                    ]

            });
        }
    }








    //
    // ------------------ //
    // V Types Search and add
    async getTypes() {
        return await this.vehicleTypeRep.find({
            relations: ['vehicles']
        });

    }

    async newVType(body: any) {
        const temp_t_data = this.vehicleTypeRep.create({
            type: body.type,
            type_ar: body.type_ar
        });

        return await this.vehicleTypeRep.save(temp_t_data);
    }


}
