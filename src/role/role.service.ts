import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./entity/role.entity";
import { Repository } from "typeorm";
import { RoleList } from "./entity/role.enum";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async getByName(name: RoleList) {
    return await this.roleRepository.findBy({ name });
  }

  async getRoleByNames(roles: RoleList[]) {
    return await Promise.all(
      roles.map(async (role) => {
        const [target] = await this.getByName(role);
        return target;
      }),
    );
  }
}
