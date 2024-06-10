import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InvitationEntity } from './entity/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
}
