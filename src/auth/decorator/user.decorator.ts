// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequest } from '../guards/role.guard';

export const UserD = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<UserRequest>();
    return data ? request.user?.[data] : request.user;
  },
);
