import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module'
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { LoginUseCases } from '../../../usecases/auth/login.usecases'
import { ExceptionsService } from '../../services/exceptions/exceptions.service'
import { LoggerService } from '../../services/logger/logger.service'
import { authErrorMessages } from '../constants/auth.contant'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any) {
    const user = await this.loginUsecaseProxy
      .getInstance()
      .validateUserForJWTStragtegy(payload.username)
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`)
      this.exceptionService.UnauthorizedException({
        message: authErrorMessages.USER_NOT_FOUND,
      })
    }
    return user
  }
}
