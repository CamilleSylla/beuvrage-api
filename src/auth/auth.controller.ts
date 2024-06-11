import { Controller, Get, Logger, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordGuard } from './guard/resetPassword.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ResetPasswordGuard)
  @Get('/register/invitation/:token')
  async registerUserInvitation(
    @Request() req: { user: { email: string; uuid: string } },
  ) {
    const { user } = req;
    this.logger.log(
      `auth.register.invitation : ${user.email} start invitation process`,
    );
    return await this.authService.verifyInvitationByUserEmail(
      user.email,
      user.uuid,
    );
  }
}
