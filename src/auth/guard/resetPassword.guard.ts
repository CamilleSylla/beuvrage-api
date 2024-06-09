import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.params.token) throw new UnauthorizedException();
    try {
      request.user = this.authService.validateResetPwdToken(
        request.params.token,
      );
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
