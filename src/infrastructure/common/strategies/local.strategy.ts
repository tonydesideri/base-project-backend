import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module'
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { LoginUseCases } from '../../../usecases/auth/login.usecases'
import { LoggerService } from '../../services/logger/logger.service'
import { ExceptionsService } from '../../services/exceptions/exceptions.service'
import { authErrorMessages } from '../constants/auth.contant'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      usernameField: 'email',
    })
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      this.logger.warn(
        'LocalStrategy',
        `E-mail or password is missing, BadRequestException`,
      )
      this.exceptionService.UnauthorizedException({
        message: authErrorMessages.EMAIL_OR_PASSWORD_MISSING,
      })
    }
    const user = await this.loginUsecaseProxy
      .getInstance()
      .validateUserForLocalStragtegy(email, password)
    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid e-mail or password`)
      this.exceptionService.UnauthorizedException({
        message: authErrorMessages.INVALID_EMAIL_OR_PASSWPRD,
      })
    }
    return user
  }
}
