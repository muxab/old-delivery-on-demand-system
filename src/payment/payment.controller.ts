import { Body, Controller, Get, HttpCode, HttpException, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Invoice } from 'src/database/invoice.entity';
import { JwtAuthGuard } from 'src/utils/auth/jwt/jwt.guard';
import { Helper } from 'src/utils/helpers/helper';
import { Role } from 'src/utils/roles/role.enum';
import { RoleGuard } from 'src/utils/roles/role.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { PaymentService } from './payment.service';


@Roles(Role.CLIENT)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('invoice')
export class PaymentController {
  constructor(private readonly invoiceService: PaymentService) {}

  @Post('/new')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: Helper.destinationPath,
      filename: Helper.customFileName,
    })
  }))
  async newInvoice( @UploadedFile() file :Express.Multer.File , @Body() body: any,@Request() req:any): Promise<Invoice> {
      console.log(file);

      // Save FIle in imgs/invoices
       // Create invoice in BD .. with shipment uuid & shipment id(FK) .. status of invoice ..(accepted , rejected , checking)..
      
    //   return file.size / 1024;
      return await this.invoiceService.newInvoice(body,req.user);
  }


 

  @Get('/check/:uuid')
  async hehe(@Param('uuid') uuid:string,@Request() req:any){
    //   return 'spojdsd';
    // return uuid;
      return await this.invoiceService.checkPaymentStatus(uuid,req.user);
  }
}



