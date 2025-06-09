
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/common/types/enums';
import { ROLES_KEY } from '../decorator/user.decorator';
import { JWTPayload } from '../stategies';

interface UserRequest extends Request {
  user?: JWTPayload; 
}


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<UserRequest>();
    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
