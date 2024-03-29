import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ExceptionsService } from 'src/infrastructure/services/exceptions/exceptions.service';
import { httpsErrorMessages } from '../constants/middleware.constant';
@Injectable()
export class HttpsMiddleware implements NestMiddleware {
  constructor(
    @Inject(ExceptionsService)
    private readonly exceptionService: ExceptionsService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Aplica a validação de conexão HTTPS apenas em ambiente de produção
    if (process.env.NODE_ENV === 'production' && req.protocol !== 'https:') {
      return this.exceptionService.ForbiddenException({
        message: httpsErrorMessages.HTTPS_CONNECTION_REQUIRED
      });
    }
    next();
  }
}
