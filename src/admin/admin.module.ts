import { Module } from '@nestjs/common';
import { AdminUserResolver } from './admin-user.resolver';
import { AdminUserService } from './admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/entity/user.entity';
import { RoleModule } from 'src/role/role.module';
import { InvitationEntity } from 'src/auth/entity/invitation.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UsersEntity, InvitationEntity]), RoleModule],
  providers: [AdminUserResolver, AdminUserService]
})
export class AdminModule {}
