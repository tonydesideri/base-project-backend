import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { LoggerModule } from './infrastructure/services/logger/logger.module'
import { ExceptionsModule } from './infrastructure/services/exceptions/exceptions.module'
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module'
import { ControllersModule } from './infrastructure/controllers/controllers.module'
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module'
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module'
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module'
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy'
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy'
import { JwtRefreshTokenStrategy } from './infrastructure/common/strategies/jwtRefresh.strategy'
import { JwtForogotPasswordTokenStrategy } from './infrastructure/common/strategies/jwtForgotPassword.strategy'
import { HttpsMiddleware } from './infrastructure/common/middlewares/https.middleware'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtForogotPasswordTokenStrategy,
  ],
})
export class AppModule implements NestModule {
  // validating if the requests are using the https protocol
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsMiddleware).forRoutes('*')
  }
}
