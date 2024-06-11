import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InvitationEntity } from './entity/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/user/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessClaims } from './types/jwt';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenEntity } from './entity/refresh-token.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(InvitationEntity)
    private readonly invitationRepository: Repository<InvitationEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
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
    if (invitation) {
      return invitation.uuid === uuid;
    }
    throw new BadRequestException();
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

  async deleteInvitation(uuid: string) {
    return await this.invitationRepository.delete({ uuid });
  }

  async compareUserPassword(id: string, pass: string) {
    const password = await this.userService.getUserPassword(id);
    return await bcrypt.compare(pass, password);
  }

  async generateAccesToken(profile: Partial<UsersEntity>) {
    return await this.jwtService.signAsync(profile, {
      secret: this.configService.get('AUTH_ACCESS_TOKEN_SK'),
    });
  }

  validateAccessToken(token: string): JwtAccessClaims {
    return this.jwtService.verify(token, {
      secret: this.configService.get('AUTH_ACCESS_TOKEN_SK'),
    });
  }

  async generateRefreshToken(id: string) {
    return jwt.sign({ id }, this.configService.get('AUTH_REFRESH_TOKEN_SK'), {
      expiresIn: '14d',
    });
  }

  async assignRefreshTokenToUser(user: UsersEntity, token: string) {
    const hashToken = await bcrypt.hash(token, 1);

    const refreshTokenInstance = plainToInstance(RefreshTokenEntity, {
      user,
      token: hashToken,
    });
    const result = await this.refreshTokenRepository.save(refreshTokenInstance);
    await this.userService.updateUserById(user.id, {
      refresh_token: result,
    });
  }

  async validateRefreshToken(id: string, token: string) {
    const hashToken = await this.userService.getUserRefreshToken(id);
    const match = await bcrypt.compare(token, hashToken);
    if (!match) throw new BadRequestException();
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('AUTH_REFRESH_TOKEN_SK'),
    });
  }
}
