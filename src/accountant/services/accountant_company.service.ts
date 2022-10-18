import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from 'src/database/company.entity';
import { CompanyType } from 'src/database/company-type.entity';
import { GloabalService } from 'src/utils/extra/global.service';
import { Role } from 'src/utils/roles/role.enum';
import { Vehicle } from 'src/database/vehicle.entity';
import { VehicleType } from 'src/database/vehicle-type.entity';

// is all Aboout clients
@Injectable()
export class AccountantCompanyService {
  
    constructor(
        @InjectRepository(Company) private companysRep: Repository<Company>,
        @InjectRepository(CompanyType) private companyTypesRep: Repository<CompanyType>,
        
        @InjectRepository(Vehicle) private vehicleRep : Repository<Vehicle>,
        @InjectRepository(VehicleType) private vehicleTypeRep : Repository<VehicleType>,
        private globalService : GloabalService,
    ) { }


    async newCompany(data:any) : Promise<Company> {

        const type = await this.companyTypesRep.findOne({
            where: {
                type: data.c_type,
            }
        });
         const company = await this.companysRep.save({
             name : data.c_name,
             type : type,
         }) ;
         return company ;
      }


      async newVehicle(data: any, ):Promise<Vehicle> {


        const company = await this.companysRep.findOne({id : data.c_id});
        const type = await this.vehicleTypeRep.findOne({
            where:{
                type: data.v_type,
            }
        });

        const vehicle_t_data = this.vehicleRep.create({
            max_load : data.max_load,
            plate_no : data.plate_no,
            liceinse_no :data.liceinse_no,
            type : type ,
            type_txt : type.type,
            company : company
        });

        return await this.vehicleRep.save(vehicle_t_data);

    }

}
