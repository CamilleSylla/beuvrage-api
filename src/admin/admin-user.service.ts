import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AdminUserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ){}

    async createUser(user: CreateUserInput) {
        const userInstance = plainToInstance(Users, user);
        console.log(userInstance);
        
        return await this.usersRepository.save(userInstance)
    }
}
