import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from 'src/domain/model/auth';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { ExceptionsService } from '../../services/exceptions/exceptions.service';
import { LoggerService } from '../../services/logger/logger.service';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
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
      this.logger.warn(
        'JwtRefreshStrategy',
        `User not found or hash not correct`
      );
      this.exceptionService.ForbiddenException({
        message: authErrorMessages.USER_NOT_FOUND_OR_HASH_NOT_CORRET,
        code_error: 403
      });
    }
    return user;
  }
}
