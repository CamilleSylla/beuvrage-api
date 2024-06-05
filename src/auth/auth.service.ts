import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService
    ){}

    async verifyInvitationMail(email: string): Promise<boolean>{
        console.log('auth.registeration.verifyEmail');
        const exist = await this.userService.getUserByEmail(email)
        return exist ? true : false
    }
}
