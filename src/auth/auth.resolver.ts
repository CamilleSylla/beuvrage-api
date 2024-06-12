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
    const profile = await this.userService.getUserByEmail(credentials.email);
    if (!profile || !profile.id) {
      this.logger.log(`auth.login: no user found for ${credentials.email}`);
      throw new BadRequestException();
    } else if (!profile.verify) {
      this.logger.log(
        `auth.login: ${credentials.email} is not a verify profile`,
      );
      throw new ForbiddenException('Profile not verified');
    } else {
      const match = await this.authService.compareUserPassword(
        profile.id,
        credentials.password,
      );
      if (!match) {
        this.logger.log(
          `auth.login: password are not matching for ${credentials.email}`,
        );
        throw new BadRequestException();
      }
      await this.userService.updateUserById(profile.id, {
        last_login: new Date(),
      });
      this.logger.log(
        `auth.login: ${credentials.email} checking for refresh token`,
      );
      const refresh_tokenExist = await this.userService.getUserRefreshToken(
        profile.id,
      );
      let refresh_token;
      if (!refresh_tokenExist) {
        refresh_token = await this.authService.generateRefreshToken(profile.id);
        this.logger.log(
          `auth.login: assigning refresh token to user ${profile.email}`,
        );
        await this.authService.assignRefreshTokenToUser(profile, refresh_token);
      }
      this.logger.log(`auth.login: ${profile.email} successfully logged in`);
      return {
        access_token: await this.authService.generateAccesToken({
          id: profile.id,
        }),
        ...(refresh_tokenExist ? {} : { refresh_token }),
      };
    }
  }
}
