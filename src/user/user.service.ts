import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
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

  async encryptPassword(password: string) {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  async updateUserById(id: string, payload: Partial<UsersEntity>) {
    this.logger.debug(`user.update: updating user ${id}`);
    return await this.userRepository.update({ id }, payload);
  }

  async getUserPassword(id: string) {
    const { password } = await this.userRepository.findOne({
      where: { id },
      select: ['password'],
    });
    return password;
  }
}
