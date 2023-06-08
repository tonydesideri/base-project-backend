import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'

import {
  AuthLoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './auth-dto.class'
import { IsAuthPresenter } from './auth.presenter'

import { JwtRefreshGuard } from '../../common/guards/jwtRefresh.guard'
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard'
import { LoginGuard } from '../../common/guards/login.guard'

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module'
import { LoginUseCases } from '../../../usecases/auth/login.usecases'
import { IsAuthenticatedUseCases } from '../../../usecases/auth/isAuthenticated.usecases'
import { LogoutUseCases } from '../../../usecases/auth/logout.usecases'

import { ForgotPasswordUseCases } from 'src/usecases/auth/forgotPassword.usecases'
import { JwtForgotPasswordGuard } from 'src/infrastructure/common/guards/jwtForgotPassword.guard'
import { ApiResponseType } from 'src/infrastructure/common/decorators/swagger/swagger.decorator'
import { User } from 'src/infrastructure/common/decorators/user/user.decorator'

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
    private readonly isAuthUsecaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
    @Inject(UsecasesProxyModule.FORGOT_PASSWORD_USECASES_PROXY)
    private readonly fotgotPasswordUsecaseProxy: UseCaseProxy<ForgotPasswordUseCases>,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Req() request: Request) {
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(auth.email)
    const refreshTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtRefreshToken(auth.email)
    /**
     * Verificar se o ambiente é de produção para adicionar a tag 'secure'
     * que adicionada uma camada de segurança para funcionar apenas com HTTPS
     */
    const secure = process.env.NODE_ENV === 'production' && 'secure'
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie.concat(`;${secure}`),
      refreshTokenCookie.concat(`;${secure}`),
    ])
    return 'Login successful'
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Req() request: Request) {
    const cookie = await this.logoutUsecaseProxy.getInstance().execute()
    request.res.setHeader('Set-Cookie', cookie)
    return 'Logout successful'
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@User() auth: IsAuthPresenter) {
    const user = await this.isAuthUsecaseProxy.getInstance().execute(auth.email)
    const response = new IsAuthPresenter()
    response.email = user.email
    return response
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: Request, @User() auth: IsAuthPresenter) {
    /**
     * Adicionando um novo Authentication cookie no header da requisição
     * com novo tempo de expiração
     */
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(auth.email)
    /**
     * Verificar se o ambiente é de produção para adicionar a tag 'secure'
     * que adicionada uma camada de segurança para funcionar apenas com HTTPS
     */
    const secure = process.env.NODE_ENV === 'production' && 'secure'
    request.res.setHeader('Set-Cookie', accessTokenCookie.concat(`;${secure}`))
    return 'Refresh successful'
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const response = await this.fotgotPasswordUsecaseProxy
      .getInstance()
      .getEmailForgotPasswordStrategy(body.email)
    return response
  }

  @Post('reset-password')
  @UseGuards(JwtForgotPasswordGuard)
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @User() auth: IsAuthPresenter,
  ) {
    await this.fotgotPasswordUsecaseProxy
      .getInstance()
      .setNewPasswordForStrategyForgotPassword(auth.email, body.password)
    return 'Reset successful'
  }
}
