import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UserOutput } from 'src/user/dto/user.output';
import { AdminUserService } from './admin-user.service';
import { UsersEntity } from 'src/user/entity/user.entity';
import { RoleOutput } from 'src/role/dto/role.output';

@Resolver(() => UserOutput)
export class AdminUserResolver {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Mutation(() => UserOutput)
  async adminCreateUser(
    @Args('user', { type: () => CreateUserInput }) user: CreateUserInput,
  ) {
    return await this.adminUserService.createUser(user);
  }

  @ResolveField(() => [RoleOutput], { name: 'role' })
  formatRoles(
    @Parent()
    user: UsersEntity,
  ) {
    return user.role;
  }
}
