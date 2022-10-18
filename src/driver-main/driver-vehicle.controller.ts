import { Body, Controller, Get, Param, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Helper } from 'src/utils/helpers/helper';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { DriverMainSecondService } from './driver-main-second.service';
import { DriverVehicleService } from './driver-vehicle.service';


@Controller('driver-vehicle')
export class DriverVehicleController {
  constructor(
    private readonly driverVehicleService: DriverVehicleService,
    private helper: Helper,
  ) { }


  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'plate', maxCount: 1, },
    { name: 'cer', maxCount: 1, },
    { name: 'side', maxCount: 1, },
    { name: 'driverlec', maxCount: 1, },
  ], {
    storage: diskStorage({
      destination: Helper.destinationPath,
      filename: Helper.customFileName,
    })
  }
  ))
  async registerVehicle(@Body() body: any, @UploadedFiles() files: Express.Multer.File,) {

    const user = await this.driverVehicleService.registerUser(body, files['driverlec'][0].filename);
    
    const vehicle = await this.driverVehicleService.registerVehicle(user.user, body);
    
     await this.driverVehicleService.registerFiles(vehicle, body, files['plate'][0].filename, files['cer'][0].filename, files['side'][0].filename);

     return user ;

  }


  @Post('add-type')
  async addTypeIfNotExist(@Body() body: any) {
    return await this.driverVehicleService.addType(body.type);
  }

  @Get('get-types')
  async getTypes() {
    return await this.driverVehicleService.getTypes();
  }


  // @Post('register')
  // @Post('register')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //   { name: 'plate', maxCount: 1 },
  //   { name: 'side', maxCount: 1 },
  //   { name: 'cer', maxCount: 1 },
  //   { name: 'driver-lic', maxCount: 1 },
  // ],{
  //   storage: diskStorage({
  //     destination: './images/vehicles',
  //     filename: Helper.customFileName,
  //   }),
  // }))
  // async registerVehicle(
  //   @Body() body: any,
  //   @UploadedFiles() files: {
  //     plate: Express.Multer.File[],
  //     side: Express.Multer.File[],
  //     cer: Express.Multer.File[],
  //     driverLec: Express.Multer.File[]
  //   }) {
  //   // images 


  //   console.log(files['ce'].fieldname);



  //   // insert Images then send urls Of It To service //
  //   // return await this.driverVehicleService.register(body.driverData, body.vData  , 'plate ', 'lec' , 'side' , 'driverLec');
  //   return 'shi';

  // }
}
