import { IBcryptService } from 'src/domain/adapters/bcrypt.interface'
import { IException } from 'src/domain/exceptions/exceptions.interface'
import {
  IJwtService,
  IJwtServicePayload,
} from '../../domain/adapters/jwt.interface'
import { IJwTConfig } from '../../domain/config/jwt.interface'
import { ILogger } from '../../domain/logger/logger.interface'
import { IUserRepository } from '../../domain/repositories/userRepository.interface'

export class ForgotPasswordUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: IJwTConfig,
    private readonly userRepository: IUserRepository,
    private readonly exceptionService: IException,
    private readonly bcryptService: IBcryptService,
  ) {}

  async getEmailForgotPasswordStrategy(email: string) {
    this.logger.log(
      'ForgotPasswordUseCases execute',
      `The user with this e-mail ${email} has requested a password change.`,
    )
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      // Caso o e-mail não esteja associado a nenhuma conta
      this.exceptionService.NotFoundException({
        message: 'User not found',
      })
    }
    // Gerar um token para a redefinição de senha
    const forgotPasswordToken = this.generateForgotPasswordToken(email)
    // Criar um hash e salvar no banco de dados
    await this.setCurrentForgotPasswordToken(email, forgotPasswordToken)
    // Geração de link codificado e com hash do roken
    const encodedLink = this.generatePasswordResetLinkEncoded(
      email,
      forgotPasswordToken,
    )

    // Aqui você pode enviar um e-mail com um link para redefinir a senha, por exemplo.
    // Implemente a lógica necessária de acordo com sua aplicação.

    return {
      message: 'Instruções para redefinição de senha enviadas por e-mail.',
      link: encodedLink,
    }
  }

  async setNewPasswordForStrategyForgotPassword(
    email: string,
    password: string,
  ) {
    // validar prolítica de senha

    // Cria um hash para a nova senha
    const currentHashedPassword = await this.bcryptService.hash(password)

    // Atualiza a senha e invalida token de redefinição de senha
    await this.userRepository.updatePasswordAndInvalidForgotPasswordToken(
      email,
      currentHashedPassword,
    )
  }

  // Método para gerar um token para a redefinição de senha (opcional)
  private generateForgotPasswordToken(email: string): string {
    // Lógica para gerar o token
    const payload: IJwtServicePayload = { email }
    const secret = this.jwtConfig.getJwtForgotPasswordSecret()
    const expiresIn = this.jwtConfig.getJwtForgotPasswordExpirationTime() + 's'
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn)
    return token
  }

  private async setCurrentForgotPasswordToken(
    email: string,
    forgotPasswordToken: string,
  ): Promise<void> {
    // Criar um hash do token gerado
    const currentHashedForgotPasswordToken = await this.bcryptService.hash(
      forgotPasswordToken,
    )
    // Salvar o token de redefinição de senha no banco de dados associado ao usuário
    await this.userRepository.updateForgotPasswordToken(
      email,
      currentHashedForgotPasswordToken,
    )
  }

  private generatePasswordResetLinkEncoded(
    email: string,
    token: string,
  ): string {
    // TODO: Não pode receber variável de ambiente no "UseCases"
    const baseUrl = process.env.TRUSTED_DOMAIN // Domínio confiável
    const path = '/api_v1/auth/reset-password'
    const queryParams = {
      email,
      token,
    }
    const encodedParams = new URLSearchParams(queryParams).toString()
    const encodedUrl = baseUrl + path + '?' + encodeURI(encodedParams)
    return encodedUrl
  }

  async getUserIfForgotPasswordTokenMatches(
    forgotPasswordToken: string,
    email: string,
  ) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user || !user.hashForgotPasswordToken) {
      return null
    }
    const isFrogotPasswordTokenMatching = await this.bcryptService.compare(
      forgotPasswordToken,
      user.hashForgotPasswordToken,
    )
    if (isFrogotPasswordTokenMatching) {
      return user
    }
    return null
  }

  validateDomainForgotPasswordLink(host: string): boolean {
    const trustedDomains = ['localhost:3000'] // Lista de domínios confiáveis
    const urlObject = new URL(host)
    const domain = urlObject.hostname
    return !trustedDomains.includes(domain)
  }
}
