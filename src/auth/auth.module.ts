import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entity/invitation.entity';
import { InvitationService } from './invitation/invitation.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { AuthResolver } from './auth.resolver';
import { RefreshTokenEntity } from './entity/refresh-token.entity';

@Module({
  imports: [
    UserModule,
    MailModule,
    TypeOrmModule.forFeature([InvitationEntity, RefreshTokenEntity]),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: await configService.get('AUTH_INVITE_SIGN'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, InvitationService, AuthResolver],
  exports: [AuthService, InvitationService],
})
export class AuthModule {}
