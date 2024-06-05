import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RoleList } from 'src/role/entity/role.enum';
import { RoleService } from 'src/role/role.service';
import { InvitationEntity } from 'src/auth/entity/invitation.entity';

@Injectable()
export class AdminUserService {
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,
        @InjectRepository(InvitationEntity)
        private invitationRepository: Repository<UsersEntity>,
        private roleService: RoleService
    ){}

    async createUser(user: CreateUserInput) {
        const role = await this.roleService.getRoleByNames(user?.role ? user?.role : [ RoleList.VIEWER ])
        const userInstance = plainToInstance(UsersEntity, {...user, role});
        const profile = await this.usersRepository.save(userInstance)
        const invitationInstance = plainToInstance(InvitationEntity, {user: profile})
        await this.invitationRepository.save(invitationInstance)
        return profile
    }    
}
