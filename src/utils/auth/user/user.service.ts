import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }


  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }
  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    // console.log(bcrypt.('sha256', password).digest('hex'));

    return await this.userRepository.findOne({
      where: {
        email: email,
        password: bcrypt.hash(password, 3),
      },
    });
  }

  async findById(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    } else {
      return { user: user };
    }
  }

  async create(user: any): Promise<User> {

    const validateEmail = await this.userRepository.find({
      where: [
        { email: user.email },
        // {phone : user.phone },
      ],
    });
    const validatePhone = await this.userRepository.find({
      where: [
        // {email : user.email},
        { phone: user.phone },
      ],
    });
    if (validateEmail.length > 0) {
      throw new HttpException('Email Used', HttpStatus.BAD_REQUEST);
    } else if (
      validatePhone.length > 0
    ) {
      throw new HttpException('Phone Used', HttpStatus.BAD_REQUEST);
    }
    else {
      // const dt = this.userRepository.create( ...user );
      return await this.userRepository.save({ ...user });
    }
  }

  async findByUuid(uuid: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
  }

  async findByPhone(phone: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        phone: phone,
      },
    });
  }




  async validateData(data: any, type: string) {

    let dataCheck: {};
    let msg: string;
    switch (type) {

      case 'phone':
        dataCheck = { phone: data };
        msg = 'phone';
        break;
      case 'lecNo':
        dataCheck = { lecNo: data };
        msg = 'lec'
        break;
      default:
        dataCheck = { email: data };
        msg = 'email';
        break;
    }

    const exist = await this.userRepository.find({
      where: 
        dataCheck,
      
    });

    if (exist.length > 0) {
      throw new HttpException(msg, HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('ok', HttpStatus.ACCEPTED);
    }

  }

}
