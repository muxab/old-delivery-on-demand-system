import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/database/user.entity';
import { Company } from 'src/database/company.entity';
import { GloabalService } from 'src/utils/extra/global.service';
import { Role } from 'src/utils/roles/role.enum';
import { AccountStatus } from 'src/utils/roles/account-status.enum';

// is all Aboout clients
@Injectable()
export class AccountantClientsService {
    constructor(
        @InjectRepository(User) private usersRep: Repository<User>,
        @InjectRepository(Company) private companysRep: Repository<Company>,
        private globalService: GloabalService,
    ) { }

    async newClient(data: any): Promise<User> {

        const pass = await this.globalService.hashPassword(data.user_password);

        const client = await this.usersRep.save({
            name: data.user_name,
            nid: data.user_nid,
            phone: data.user_phone,
            email: data.user_email,
            password: pass,
            role: Role.CLIENT,
        });

        return client;
    }

    async showClient(id: number): Promise<User> {

        const client = await this.usersRep.findOne({
            where: {
                id: id
            },
        });

        return client;
    }

    async banClient(id: number): Promise<User> {

        const client = await this.usersRep.findOne({
            id: id,
        });

        client.status = AccountStatus.BANNED;
        this.usersRep.save(client);
        return client;
    }


    async balanceClient(id: number, balance : number): Promise<User> {

        console.log(balance);
        
        const client = await this.usersRep.findOne({
            id: id,
        });

        var x = client.balance + balance;
        console.log(x);
         
        client.balance =x ;
        this.usersRep.save(client);
        return client;
    }



    async searchClient(data: any): Promise<any> {
        console.log('queryyyyy');

        const client = await this.usersRep.find({
            where: [
                { id: Like(`%${data.query}%`), },
                { phone: Like(`%${data.query}%`) },
                { name: Like(`%${data.query}%`) },
                { email: Like(`%${data.query}%`) },
            ]
        });


        return client;
    }
}
