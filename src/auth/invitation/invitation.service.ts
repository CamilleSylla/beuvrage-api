import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationEntity } from '../entity/invitation.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InvitationService {

    constructor(
        @InjectRepository(InvitationEntity)
        private readonly invitationRepository: Repository<InvitationEntity>
    ){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteOldRecords(): Promise<void>{
        const date = new Date();
        date.setDate(date.getDate() - 5);
        await this.invitationRepository.delete({createdAt: LessThan(date)})
    }    
}
