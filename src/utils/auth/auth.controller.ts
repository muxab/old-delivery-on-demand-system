import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/database/user.entity';
import { Role } from '../roles/role.enum';
import { RoleGuard } from '../roles/role.guard';
import { Roles } from '../roles/roles.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginUserDto): Promise<any> {
    
    
    return this.authService.login(user.email, user.password);
    // return user;
  }

  @Post('register')
  async register(@Body() user: any): Promise<any> {
    
    return this.authService.register(user);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('validate/admin')
  async adminV(@Request() data: any) {
    // console.log(data);
    
    const user = await this.authService.validate(data.user.id);
    // user.password = undefined;
    return { user: user };
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('validate/client')
  async clientV(@Request() data: any) {
    const user = await this.authService.validate(data.user.id);
    // user.password = undefined;
    return  user ;
  }
  @Roles(Role.DRIVER)
  @UseGuards(JwtAuthGuard,RoleGuard)
  @Get('validate/driver')
  async driverV(@Request() data: any) {
    
    const user = await this.authService.validate(data.user.id);
    // user.password = undefined;
    
    // console.log(user);
    return user ;
    // return { user: user };
  }


  @Post('/existance')
  async checkExistance(@Body() body : any){
    
    return await this.authService.existance(body.field , body.type);
  }

  
}
