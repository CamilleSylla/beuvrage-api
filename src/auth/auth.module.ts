import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entity/invitation.entity';
import { InvitationService } from './invitation/invitation.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule, 
    TypeOrmModule.forFeature([InvitationEntity]),
    ScheduleModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [AuthService, InvitationService],
  exports: [AuthService]
})
export class AuthModule {}
