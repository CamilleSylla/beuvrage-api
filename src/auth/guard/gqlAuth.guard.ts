import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    const authorization = ctx.getContext().req?.headers?.authorization;
    const bearer = authorization.split(' ')[0];
    if (bearer !== 'Bearer') throw new UnauthorizedException();
    const token = authorization.split(' ')[1];
    try {
      const claims = this.authService.validateAccessToken(token);

      if (claims.id) {
        request.user = this.userService
          .getUserById(claims.id as string)
          .then((user) => user);
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }
}
