import { IsEmail, IsString, IsNotEmpty, MinLength, } from 'class-validator';


export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}


export class RegisterDto {
  @IsEmail()
  email: string;
 
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  phone : number;
}
 