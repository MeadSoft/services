import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: Request, _: Response, next: NextFunction) {
        this.logger.log(`${req.method} ${req.originalUrl}`);
        next();
    }
}
