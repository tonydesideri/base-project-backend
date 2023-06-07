import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service'
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module'
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { ITokenPayload } from '../../../domain/model/auth'
import { LoggerService } from '../../logger/logger.service'
import { ExceptionsService } from '../../exceptions/exceptions.service'
import { ForgotPasswordUseCases } from 'src/usecases/auth/forgotPassword.usecases'

@Injectable()
export class JwtForogotPasswordTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-forgot-password-token',
) {
  constructor(
    private readonly configService: EnvironmentConfigService,
    @Inject(UsecasesProxyModule.FORGOT_PASSWORD_USECASES_PROXY)
    private readonly forgotPasswordUsecaseProxy: UseCaseProxy<ForgotPasswordUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      /**
       * Decodifica a url e valida o token de acesso com o tempo de expiraçao e formato
       */
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: configService.getJwtForgotPasswordSecret(),
      passReqToCallback: true,
    })
  }

  async validate(request: Request, payload: ITokenPayload) {
    /**
     * Validação para apenas domínios confiáveis
     */
    const host = request.get('Host')
    const isValidateHost = this.forgotPasswordUsecaseProxy
      .getInstance()
      .validateDomainForgotPasswordLink(host)

    if (!isValidateHost) {
      this.logger.warn(
        'JwtForgotPasswordStrategy',
        `Domain is not valid for this request`,
      )
      this.exceptionService.UnauthorizedException({
        message: 'Domain is not valid for this request',
      })
    }

    /**
     * Validação para saber se o usuário existe e
     * Validação para saber se o hash salvo no banco é válido
     */
    const { token: forgotPasswordToken } = request.query
    const user = await this.forgotPasswordUsecaseProxy
      .getInstance()
      .getUserIfForgotPasswordTokenMatches(
        String(forgotPasswordToken),
        payload.email,
      )

    if (!user) {
      this.logger.warn(
        'JwtForgotPasswordStrategy',
        `User not found or hash not correct`,
      )
      this.exceptionService.UnauthorizedException({
        message: 'User not found or hash not correct',
      })
    }
    return user
  }
}
