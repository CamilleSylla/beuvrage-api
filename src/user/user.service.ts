import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UsersEntity } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUserById(id: string, payload: Partial<UsersEntity>) {
    return await this.userRepository.update({ id }, payload);
  }
}
