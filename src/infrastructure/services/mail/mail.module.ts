import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ISmtpConfig } from 'src/domain/config/smtp.interface'
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service'
import { MailService } from './mail.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      useFactory: async (smtpConfig: ISmtpConfig) => ({
        transport: {
          host: smtpConfig.getSmtpHost(),
          secure: false,
          auth: {
            user: smtpConfig.getSmtpUser(),
            pass: smtpConfig.getSmtpPass(),
          },
        },
        defaults: {
          from: '<sendgrid_from_email_address>',
        },
      }),
      inject: [EnvironmentConfigService],
    }),
    EnvironmentConfigModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
