import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { generate } from 'shortid';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/user.entity';

@Injectable()
export class GloabalService {


  async uniqueNumber(prefix: any, suffix: any): Promise<string> {

    const firstLetter = prefix.charAt(0);
    const secondLetter = suffix.charAt(0);
    
    const uniqueN = firstLetter.toUpperCase() + secondLetter.toUpperCase() + generate();
    return uniqueN;


  }

  // async clientUniqueId(user:User) : Promise<string> {
  //   const firstLetter = user.name.charAt(0);
  //   const uniqueN = firstLetter.toUpperCase() +
  //     [user.nid.charAt(0) + user.nid.charAt(1) + user.nid.charAt(2)]
  //     + generate();
  //   return uniqueN;
  // }

  async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        { msg: 'Wrong credentials provided' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return isPasswordMatching;
  }

  async hashPassword(password: string): Promise<string> {
    const hashPass = await bcrypt.hash(password, 3);

    return hashPass;

  }
}
