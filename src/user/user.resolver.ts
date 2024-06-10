import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserOutput } from './dto/user.output';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Logger } from '@nestjs/common';

@Resolver()
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Query(() => String)
  getUser() {
    return 'hello';
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
}
