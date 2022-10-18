import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { GloabalService } from '../extra/global.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    GloabalService,
    AccountService,
  ],
  controllers: [AuthController, AccountController],
  exports: [AuthService, AccountService,UserService],
})
export class AuthModule {}
