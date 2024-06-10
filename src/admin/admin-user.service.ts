import { Injectable } from '@nestjs/common';
import { AdminCreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RoleList } from 'src/role/entity/role.enum';
import { RoleService } from 'src/role/role.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
  ) {}

  async createUser(user: AdminCreateUserInput) {
    const role = await this.roleService.getRoleByNames(
      user?.role ? user?.role : [RoleList.VIEWER],
    );
    const userInstance = plainToInstance(UsersEntity, { ...user, role });
    const profile = await this.usersRepository.save(userInstance);
    await this.authService.createResetPasswordMail(profile);
    return profile;
  }
}
