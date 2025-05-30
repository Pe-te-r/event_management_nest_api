// common/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/responseType';

@Catch()
export class AllExceptionsFilter<T = unknown> implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseBody = exception.getResponse();

      // Extract message from exception response
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && (responseBody as any).message) {
        const msg = (responseBody as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiResponse<T> = {
      status: 'error',
      message,
    };

    response.status(statusCode).json(errorResponse);
  }
}
