import { Module } from '@nestjs/common';
import { AdminUserResolver } from './admin-user.resolver';
import { AdminUserService } from './admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/entity/user.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Users])],
  providers: [AdminUserResolver, AdminUserService]
})
export class AdminModule {}
