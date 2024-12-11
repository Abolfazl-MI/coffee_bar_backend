import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, RequestHandler, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger('HTTP');

  use(req: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    // const userAgent = req.get('user-agent') || '';
    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.log(`${method} ${originalUrl}: ${statusCode} ${ip}`);
    });
    next();
  }
}
