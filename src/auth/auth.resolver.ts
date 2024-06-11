import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginOutput } from './dto/login.output';
import { LoginInput } from './dto/login.input';
import { UserService } from 'src/user/user.service';
import {
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Mutation(() => LoginOutput)
  async login(
    @Args('credentials', { type: () => LoginInput }) credentials: LoginInput,
  ) {
    this.logger.log(`auth.login: ${credentials.email} trying to login`);
    const { id, verify } = await this.userService.getUserByEmail(
      credentials.email,
    );
    if (!id) {
      this.logger.log(`auth.login: no user found for ${credentials.email}`);
      throw new BadRequestException();
    } else if (!verify) {
      this.logger.log(
        `auth.login: ${credentials.email} is not a verify profile`,
      );
      throw new ForbiddenException('Profile not verified');
    }
    const match = await this.authService.compareUserPassword(
      id,
      credentials.password,
    );
    if (!match) {
      this.logger.log(
        `auth.login: password are not matching for ${credentials.email}`,
      );
      throw new BadRequestException();
    }
    await this.userService.updateUserById(id, { last_login: new Date() });
    this.logger.log(`auth.login: ${credentials.email} successfully logged in`);
    return {
      access_token: await this.authService.generateAccesToken({ id }),
    };
  }
}
