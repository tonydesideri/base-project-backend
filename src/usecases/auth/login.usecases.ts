import { ILoggerService } from 'src/domain/adapters/logger.interface'
import { IBcryptService } from '../../domain/adapters/bcrypt.interface'
import {
  IJwtService,
  IJwtServicePayload,
} from '../../domain/adapters/jwt.interface'
import { IJwTConfig } from '../../domain/config/jwt.interface'
import { IUserRepository } from '../../domain/repositories/userRepository.interface'

export class LoginUseCases {
  constructor(
    private readonly logger: ILoggerService,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: IJwTConfig,
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  async getCookieWithJwtToken(email: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user with this e-mail ${email} have been logged.`,
    )
    const payload: IJwtServicePayload = { email }
    const secret = this.jwtConfig.getJwtSecret()
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's'
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn)
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`
  }

  async getCookieWithJwtRefreshToken(email: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user with this e-mail ${email} have been logged.`,
    )
    const payload: IJwtServicePayload = { email }
    const secret = this.jwtConfig.getJwtRefreshSecret()
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's'
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn)
    await this.setCurrentRefreshToken(token, email)
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`
    return cookie
  }

  async validateUserForLocalStragtegy(email: string, pass: string) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      return null
    }
    const match = await this.bcryptService.compare(pass, user.password)
    if (user && match) {
      await this.updateLoginTime(user.email)
      const { password, ...result } = user
      return result
    }
    return null
  }

  async validateUserForJWTStragtegy(email: string) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      return null
    }
    return user
  }

  async updateLoginTime(email: string) {
    await this.userRepository.updateLastLogin(email)
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    )
    await this.userRepository.updateRefreshToken(
      email,
      currentHashedRefreshToken,
    )
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      return null
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      user.hashRefreshToken,
    )
    if (isRefreshTokenMatching) {
      return user
    }

    return null
  }
}
