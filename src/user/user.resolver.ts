import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserOutput } from "./dto/user.output";
import { CreateUserInput } from "./dto/create-user.input";
import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { BadRequestException, Logger, UseGuards } from "@nestjs/common";
import { UpdateUserPasswordInput } from "./dto/update-user-password.input";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { GqlAuthGuard } from "src/auth/guard/gql.guard";

@Resolver()
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Query(() => String)
  getUser() {
    return "hello";
  }

  @Mutation(() => UserOutput)
  async createUser(
    @Args("payload", { type: () => CreateUserInput }) payload: CreateUserInput,
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
  @UseGuards(GqlAuthGuard)
  async changeUserPassword(
    @CurrentUser() user: { email: string; uuid: string },
    @Args("payload", { type: () => UpdateUserPasswordInput })
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
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
