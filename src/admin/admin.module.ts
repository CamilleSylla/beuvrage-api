import { Module } from '@nestjs/common';
import { AdminUserResolver } from './admin-user.resolver';
import { AdminUserService } from './admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/entity/user.entity';
import { RoleModule } from 'src/role/role.module';
import { InvitationEntity } from 'src/auth/entity/invitation.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, InvitationEntity]),
    RoleModule,
    AuthModule,
    MailModule,
    UserModule,
  ],
  providers: [AdminUserResolver, AdminUserService, MailService],
})
export class AdminModule {}
