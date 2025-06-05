import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logFilePath: string;

  constructor() {
    const logsDir = join(process.cwd(), 'logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir);
      console.log('Created logs directory:', logsDir);
    } else {
      console.log('Logs directory exists:', logsDir);
    }
    this.logFilePath = join(logsDir, 'requests.log');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body } = req;
    const timestamp = new Date().toISOString();

    const logEntry = `[${timestamp}] ${method} ${originalUrl}\nHeaders: ${JSON.stringify(headers)}\nBody: ${JSON.stringify(body)}\n\n`;

    try {
      appendFileSync(this.logFilePath, logEntry, { encoding: 'utf8' });
    } catch (err) {
      console.error('Failed to write log:', err);
    }

    next();
  }
}
