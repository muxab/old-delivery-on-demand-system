import { HttpException, HttpStatus, Injectable, } from '@nestjs/common';
import { UserService } from './user/user.service';
import { User } from 'src/database/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {


    const user = await this.userService.findByEmail(email);
    if (user == null || user == undefined) {

      return {
        status: HttpStatus.UNAUTHORIZED,
        msg: 'CE',
        //CE Means Credintials Error//
      };
    }
    
    const passValidataion = await this.verifyPassword(password, user.password);
    
    if (!user || !passValidataion) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        msg: 'CE',
        //CE Means Credintials Error//
      };

      //
    } else {

      const payload = {
        id: user.id,
        name: user.name,
        role: user.role,
        status: user.status
      };
      return {
        token: this.jwtService.sign(payload, { secret: 'nestJsTutorial' }),
      };

    }

  }


  // register clients 
  async register(data: User) {
    const hashPass = await bcrypt.hash(data.password, 3);

    const user = await this.userService.create({
      ...data,
      password: hashPass,
    });

    // after successfull registration .. return token .. ease of use 
    // user shouldn't sign in after registeration
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      status: user.status
    };
  

    return {
      token: this.jwtService.sign(payload, { secret: 'nestJsTutorial' }),
      user: user
    };

  }
  // register Drivers 
  async registerDriver(data: User, lecPath: any) {
    const hashPass = await bcrypt.hash(data.password, 3);

    const user = await this.userService.create({
      ...data,
      lecPath: lecPath,
      password: hashPass,
      role: Role.DRIVER,
    });

    // after successfull registration .. return token .. ease of use 
    // driver shouldn't sign in after registeration
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      status: user.status
    };
    return {
      token: this.jwtService.sign(payload, { secret: 'nestJsTutorial' }),
      user: user,
    };

  }

  //  check if Password Hash true compared to password text
  private async verifyPassword(plainTextPassword: string,hashedPassword: string,) {
    
    return await bcrypt.compare(
        plainTextPassword,
        hashedPassword,
      );

  }

  async validate(id: number) {
    return this.userService.findById(id);
  }

  async existance(data: any, type: string) {
    return await this.userService.validateData(data, type);
  }
}
