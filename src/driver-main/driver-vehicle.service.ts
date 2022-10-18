import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Vehicle } from 'src/database/vehicle.entity';
import { Repository } from 'typeorm';

import { VehicleData } from 'src/database/vehicle-data.entity';
import { AuthService } from 'src/utils/auth/auth.service';
import { VehicleType } from 'src/database/vehicle-type.entity';
import { Notification } from 'src/database/notification.entity';



@Injectable()
export class DriverVehicleService {
  
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleType) private vehicleTypeRepo: Repository<VehicleType>,
    @InjectRepository(VehicleData) private vehicleDataRepo: Repository<VehicleData>,
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
    private authService: AuthService,
  ) { }


  async getTypes() {
    return await this.vehicleTypeRepo.find();
  }

  
  async addType(type: any) {
    const vType = this.vehicleTypeRepo.create({
      type_ar : type,
    });
    return await this.vehicleTypeRepo.save(vType); 
  }


  async registerUser(body: any , lecPath : any) {
    return await this.authService.registerDriver(body, lecPath);
  }

  ////
  async registerVehicle(user: any, vData: any,) {

    const vType = await this.vehicleTypeRepo.findOne({
      where: [
        {type_ar : vData.type},
        { type : vData.type },
      ],
    })
    const cVehicle = this.vehicleRepo.create({
      liceinse_no: vData.liceinseNo,
      plate_no: vData.plate_no,
      driver: user,
      type : vType,
      type_txt : vType.type_ar ,
      max_load : vData.max_load,
    });

     await this.notificationRepo.save({
        message : 'شكرا لتسجيــلك معانا .. نتمنى ليك التوفيق',
        user : user,
    });
    return await this.vehicleRepo.save(cVehicle);

  }

  async registerFiles(vehicle : Vehicle , data: any, plate: any, cer: any, side: any) {

    const vData = this.vehicleDataRepo.create({
      plateImg: plate,
      cerImg: cer,
      sideImg: side,
      license_no: data.license_no,
      plate_no: data.plate_no,
      vehicle: vehicle,
      type_txt : vehicle.type_txt
    });

    return await this.vehicleDataRepo.save(vData);
  }

}