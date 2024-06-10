import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InvitationEntity } from './entity/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/user/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(InvitationEntity)
    private readonly invitationRepository: Repository<InvitationEntity>,
  ) {}

  async verifyInvitationByUserEmail(
    email: string,
    uuid: string,
  ): Promise<boolean> {
    this.logger.log(
      `auth.register.invitation.verifyEmail : ${email} checking if user exist`,
    );
    const { id: userId, verify } = await this.userService.getUserByEmail(email);
    this.logger.log(
      `auth.register.invitation.verifyInvationUUID : ${email} comparing invitation uuids`,
    );
    const invitation = await this.invitationRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!verify)
      await this.userService.updateUserById(userId, { verify: true });
    return invitation.uuid === uuid;
  }

  async generateResetPwdToken(payload: { email: string; uuid: string }) {
    return await this.jwtService.signAsync(payload);
  }

  validateResetPwdToken(token: string) {
    return this.jwtService.verify(token);
  }

  async createResetPasswordMail(user: UsersEntity) {
    this.logger.log(
      `auth.invitation.create: create a new invitation for ${user.email}`,
    );
    const invitationInstance = plainToInstance(InvitationEntity, {
      user,
    });
    const invitation = await this.invitationRepository.save(invitationInstance);
    this.logger.log(
      `auth.invitation.create: generating invitation token ${user.email}`,
    );
    const token = await this.generateResetPwdToken({
      email: user.email,
      uuid: invitation.uuid,
    });
    this.logger.log(
      `auth.invitation.create: sending invitation email ${user.email}`,
    );
    await this.mailService.sendInvitaitonMail(
      user.email,
      '/auth/register/invitation/' + token,
    );
  }
}
