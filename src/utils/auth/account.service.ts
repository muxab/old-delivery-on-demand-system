import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/database/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GloabalService } from '../extra/global.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private global: GloabalService,
  ) { }
  async changePass(password: string, newPassword: string, user: any) {
    const client = await this.userRepo.findOne({ id: user.id });
    const success = await this.global.verifyPassword(password, client.password);
    client.password = undefined;
    // return password;
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    //   return newPassword;
    if (success) {
      const Hashpassword = await bcrypt.hash(newPassword, 3);
      await this.userRepo.save({
        id: client.id,
        password: Hashpassword
      });
      return {
        token: this.jwtService.sign(payload, { secret: 'nestJsTutorial' }),
      };
    }
    return new HttpException('Success', HttpStatus.OK);

  }

  //Change Email
  async changeEmail(password: string, newEmail: string, user: any) {


    const client = await this.userRepo.findOne({ id: user.id });

    const clientEmail = await this.userRepo.count({ email: newEmail });
    if (clientEmail > 0) {
      return new HttpException('exist', HttpStatus.NOT_ACCEPTABLE);
    }
    const success = await this.global.verifyPassword(password, client.password);



    if (success) {
      client.email = newEmail;
      client.save();
    }
    return new HttpException('Success', HttpStatus.OK);


  }


  //Change Phone
  async changePhone(password: string, newPhone: string, user: any) {
    
    const client = await this.userRepo.findOne({ id: user.id });

    const clientEmail = await this.userRepo.count({ phone: newPhone });
    if (clientEmail > 0) {
      return new HttpException('exist', HttpStatus.NOT_ACCEPTABLE);
    }

    const success = await this.global.verifyPassword(password, client.password);

    if (success) {
      client.phone = newPhone;
      client.save();
    }
    return new HttpException('Success', HttpStatus.OK);

  }

}