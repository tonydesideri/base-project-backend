import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import { IException } from 'src/domain/adapters/exceptions.interface';
import {
  IJwtService,
  IJwtServicePayload
} from 'src/domain/adapters/jwt.interface';
import { ILoggerService } from 'src/domain/adapters/logger.interface';
import { IMailService } from 'src/domain/adapters/mail.interface';
import { IJwTConfig } from 'src/domain/config/jwt.interface';
import { postgresErrorCode } from 'src/infrastructure/common/constants/postgres.constant';
import { userErrorMessages } from 'src/infrastructure/common/constants/user.contant';
import { UserM } from '../../domain/model/user';
import { IUserRepository } from './../../domain/repositories/userRepository.interface';
const bcrypt = require('bcrypt');

export class AddUserUseCases {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userRepository: IUserRepository,
    private readonly exceptionService: IException,
    private readonly mailService: IMailService,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: IJwTConfig,
    private readonly bcryptService: IBcryptService,
    private readonly baseUrl: string
  ) {
    // TODO: Injetar a dependencia de variáveis de ambiente
    this.baseUrl = process.env.TRUSTED_DOMAIN;
  }

  async create(name: string, email: string, password: string): Promise<UserM> {
    try {
      // Gerar um token para a redefinição de senha
      const emailConfirmationToken = this.generateEmailConfirmationToken(email);
      // Criar um hash do token gerado
      const hashedEmailConfirmationToken = await this.bcryptService.hash(
        emailConfirmationToken
      );

      const user = new UserM();
      user.name = name;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);
      user.hashEmailConfirmationToken = hashedEmailConfirmationToken;
      const result = await this.userRepository.insert(user);

      // Geração de link codificado e com hash do roken
      const encodedLink = this.generateEmailConfirmationLinkEncoded(
        email,
        emailConfirmationToken
      );

      this.mailService.sendMail({
        subject: 'Confirme seu e-mail para começar a user a Localhost',
        to: email,
        template: 'email-confirmation',
        context: {
          confirmationLink: encodedLink
        }
      });

      this.logger.log('addUserUseCases execute', 'New User have been inserted');
      return result;
    } catch (error) {
      this.logger.log('addUserUseCases execute error', 'Error insert new User');
      if (error?.code === postgresErrorCode.UNIQUE_VIOLATION) {
        this.exceptionService.BadRequestException({
          message: userErrorMessages.EMAIL_ALREADY_EXISTS
        });
      }

      this.exceptionService.BadRequestException({
        message: error?.message
      });
    }
  }

  async setEmailConfirmation(
    host: string,
    token: string,
    email: string
  ): Promise<void> {
    console.log(email);
    /**
     * Validação para apenas domínios confiáveis
     */
    const isValidateHost = this.validateDomainEmailConfirmationLink(host);

    if (!isValidateHost) {
      this.logger.warn(
        'UserEmailConfirmation',
        `Domain is not valid for this request`
      );
      this.exceptionService.UnauthorizedException({
        message: userErrorMessages.DOMAIN_NOT_VALID_REQUEST
      });
    }

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      this.logger.warn('UserEmailConfirmation', `User not found`);

      this.exceptionService.UnauthorizedException({
        message:
          'Validação de e-mail não pode ser concluída. Solicite um novo link de validação de e-mail'
      });
    }

    if (user.isVerifiedEmail) {
      return;
    }

    /**
     * Validação para saber se o hash salvo no banco é válido
     */
    const userMatch = await this.getUserIfEmailConfirmationTokenMatches(
      String(token),
      user.hashEmailConfirmationToken
    );

    if (!userMatch) {
      this.exceptionService.UnauthorizedException({
        message: userErrorMessages.TOKEN_INVALID_OR_EXPIRED_EMAIL_CONFIRMATION
      });
    }

    await this.userRepository.updateUserAndInvalidateEmailConfirmationToken(
      email
    );
  }

  private generateEmailConfirmationToken(email: string): string {
    const payload: IJwtServicePayload = { email };
    const secret = this.jwtConfig.getJwtEmailConfirmationSecret();
    const expiresIn =
      this.jwtConfig.getJwtEmailConfirmationExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return token;
  }

  private generateEmailConfirmationLinkEncoded(
    email: string,
    token: string
  ): string {
    const path = '/email-confirmation';
    const queryParams = {
      email,
      token
    };
    const encodedParams = new URLSearchParams(queryParams).toString();
    const encodedUrl = this.baseUrl + path + '?' + encodeURI(encodedParams);
    return encodedUrl;
  }

  private validateDomainEmailConfirmationLink(host: string): boolean {
    const trustedDomains = [`${this.baseUrl}`]; // Lista de domínios confiáveis
    const urlObject = new URL(host);
    const domain = urlObject.hostname;
    return !trustedDomains.includes(domain);
  }

  private async getUserIfEmailConfirmationTokenMatches(
    emailConfirmationToken: string,
    hashEmailConfirmationToken: string
  ) {
    const isEmailConfirmationTokenMatching = await this.bcryptService.compare(
      emailConfirmationToken,
      hashEmailConfirmationToken
    );

    return isEmailConfirmationTokenMatching;
  }
}
