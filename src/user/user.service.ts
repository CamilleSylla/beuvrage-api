import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async createUser(payload: CreateUserInput) {
    const userInstance = plainToInstance(UsersEntity, payload);
    return await this.userRepository.save(userInstance);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUserById(id: string, payload: Partial<UsersEntity>) {
    return await this.userRepository.update({ id }, payload);
  }
}
