// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserD = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
