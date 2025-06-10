import {
  Injectable,
  ExecutionContext,
} from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerStorage,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

@Injectable()
export class EmailThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storage: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storage, reflector);
  }
  // Handle block with either email if logged in or ip
  protected async getTracker(req: any): Promise<string> {
    return req.user?.email ?? req.ip;
  }

  protected getRequestResponse(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    return { req, res };
  }
}
