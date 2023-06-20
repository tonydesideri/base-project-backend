import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { ITokenPayload } from '../../../domain/model/auth';
import { LoggerService } from '../../services/logger/logger.service';
import { ExceptionsService } from '../../services/exceptions/exceptions.service';
import { authErrorMessages } from '../constants/auth.contant';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(
    private readonly configService: EnvironmentConfigService,
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        }
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: ITokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    const user = this.loginUsecaseProxy
      .getInstance()
      .getUserIfRefreshTokenMatches(refreshToken, payload.email);
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      this.exceptionService.UnauthorizedException({
        message: authErrorMessages.USER_NOT_FOUND_OR_HASH_NOT_CORRET
      });
    }
    return user;
  }
}
