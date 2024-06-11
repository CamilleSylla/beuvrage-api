import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { RoleList } from 'src/role/entity/role.enum';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private readonly roleService: RoleService,
  ) {}

  async createUser(payload: CreateUserInput) {
    const role = await this.roleService.getByName(RoleList.VIEWER);
    const userInstance = plainToInstance(UsersEntity, { ...payload, role });
    return await this.userRepository.save(userInstance);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserRoleById(id: string) {
    const { role } = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
      select: ['role'],
    });
    return role;
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

  async getUserRefreshToken(id: string) {
    const { refresh_token } = await this.userRepository.findOne({
      where: { id },
      relations: ['refresh_token'],
    });
    if (refresh_token) {
      return refresh_token.token;
    } else {
      return null;
    }
  }
}
