import { Module } from '@nestjs/common';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/entity/user.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Users])],
  providers: [AdminResolver, AdminService]
})
export class AdminModule {}
