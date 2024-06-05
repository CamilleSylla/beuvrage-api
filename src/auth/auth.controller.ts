import { BadGatewayException, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}
    @Get('/register/:token')
    async registerUserInvitation(){
        const email = 'email@gmail.com'
        const validEmail = await this.authService.verifyInvitationMail(email)
        if(!validEmail) throw new BadGatewayException(`Cannot find invitation for user : ${email}`)
         
    }
}
