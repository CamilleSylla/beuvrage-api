import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserOutput } from './dto/user.output';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { UpdateUserPasswordInput } from './dto/update-user-password.input';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { GqlResetPasswordAuthGuard } from 'src/auth/guard/gqlResetPassword.guard';
import { GqlAuthGuard } from 'src/auth/guard/gqlAuth.guard';
import { UsersEntity } from './entity/user.entity';
import { RoleOutput } from 'src/role/dto/role.output';

@Resolver(() => UserOutput)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Query(() => UserOutput)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: UsersEntity) {
    return user;
  }

  @Mutation(() => UserOutput)
  async createUser(
    @Args('payload', { type: () => CreateUserInput }) payload: CreateUserInput,
  ) {
    this.logger.log(
      `user.create: starting create user basic flow for ${payload.email}`,
    );
    const user = await this.userService.createUser(payload);
    await this.authService.createResetPasswordMail(user);
    this.logger.log(`user.create: user ${user.email} created successfully`);
    return user;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlResetPasswordAuthGuard)
  async changeUserPassword(
    @CurrentUser() user: { email: string; uuid: string },
    @Args('payload', { type: () => UpdateUserPasswordInput })
    payload: UpdateUserPasswordInput,
  ) {
    await this.authService.verifyInvitationByUserEmail(user.email, user.uuid);
    const { password } = payload;
    const { id } = await this.userService.getUserByEmail(user.email);
    try {
      await this.userService.updateUserById(id, {
        password: await this.userService.encryptPassword(password),
      });
      await this.authService.deleteInvitation(user.uuid);
      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @ResolveField(() => [RoleOutput], { name: 'role' })
  async formatRoles(
    @Parent()
    user: UsersEntity,
  ) {
    const { id } = user;
    const { role } = await this.userService.getUserRoleById(id);
    return role;
  }
}
