import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Journey } from 'src/database/journey.entity';
import { Shipment } from 'src/database/shipment.entity';
import { User } from 'src/database/user.entity';

import { JourneyStatus } from 'src/utils/enums/jstatus.enum';
import { ShipmentStatus } from 'src/utils/enums/s-status.enum';
import { Company } from 'src/database/company.entity';
import { Role } from 'src/utils/roles/role.enum';
import { GloabalService } from 'src/utils/extra/global.service';
import { AccountStatus } from 'src/utils/roles/account-status.enum';

// is all Aboout drivers
@Injectable()
export class AccountantDriversService {
    constructor(
        @InjectRepository(User) private usersRep: Repository<User>,
        @InjectRepository(Company) private companysRep: Repository<Company>,
        private globalService: GloabalService,
    ) { }


    async newDriver(data: any): Promise<User> {

        const pass = await this.globalService.hashPassword(data.user_password);

        const driver = await this.usersRep.save({
            name: data.user_name,
            nid: data.user_nid,
            phone: data.user_phone,
            email: data.user_email,
            password: pass,
            role: Role.DRIVER,
        });

        return driver;
    }

    async showDriver(id: number): Promise<User> {

        const driver = await this.usersRep.findOne({
            id: id,
        });

        driver.status = AccountStatus.BANNED;
        this.usersRep.save(driver);
        return driver;
    }

    async banDriver(id: number): Promise<User> {

        const driver = await this.usersRep.findOne({
            id: id,
        });

        return driver;
    }


}