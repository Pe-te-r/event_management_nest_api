import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']; // OR: req.get('Authorization')

    console.log('\nRequest...');
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.originalUrl}`);
    console.log(`Authorization Header: ${authHeader || 'Not provided'}`);
    console.log('Request...');
    next();
  }
}
