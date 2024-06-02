import { Module } from '@nestjs/common';
import { AdminUserResolver } from './admin-user.resolver';
import { AdminUserService } from './admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/entity/user.entity';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports : [TypeOrmModule.forFeature([UsersEntity]), RoleModule],
  providers: [AdminUserResolver, AdminUserService]
})
export class AdminModule {}
