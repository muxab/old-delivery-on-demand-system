import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('account')
export class AccountController {
    constructor(
        private accountService: AccountService
    ) { }

    
    @UseGuards(JwtAuthGuard)
    @Post('/password')
    async editPassword(@Body() data: any, @Request() req: any) {
        // return data.password;

        return await this.accountService.changePass(
            data.password,
            data.newPassword,
            req.user,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('/email')
    async editEmail(@Body() data: any, @Request() req: any) {
        return await this.accountService.changeEmail(
            data.password,
            data.newEmail,
            req.user,
        );
    }


    @UseGuards(JwtAuthGuard)
    @Post('/phone')
    async editPhone(@Body() data: any, @Request() req: any) {
        return await this.accountService.changePhone(
            data.password,
            data.newPhone,
            req.user,
        );
    }
}
