import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnviromentConfig } from 'src/domain/config/enviroment.interface';
import { ISmtpConfig } from 'src/domain/config/smtp.interface';
import { IDatabaseConfig } from '../../../domain/config/database.interface';
import { IJwTConfig } from '../../../domain/config/jwt.interface';

@Injectable()
export class EnvironmentConfigService
  implements IDatabaseConfig, IJwTConfig, IEnviromentConfig, ISmtpConfig
{
  constructor(private configService: ConfigService) {}

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  getJwtForgotPasswordSecret(): string {
    return this.configService.get<string>('JWT_FORGOT_PASSWORD_TOKEN_SECRET');
  }

  getJwtForgotPasswordExpirationTime(): string {
    return this.configService.get<string>(
      'JWT_FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME'
    );
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA');
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE');
  }

  getTrustedDomain(): string {
    return this.configService.get<string>('TRUSTED_DOMAIN');
  }

  getSmtpHost(): string {
    return this.configService.get<string>('SMTP_HOST');
  }

  getSmtpPort(): number {
    return this.configService.get<number>('SMTP_PORT');
  }

  getSmtpUser(): string {
    return this.configService.get<string>('SMTP_USER');
  }

  getSmtpPass(): string {
    return this.configService.get<string>('SMTP_PASS');
  }
}
