import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { ISmtpConfig } from 'src/domain/config/smtp.interface';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { MailService } from './mail.service';

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
            pass: smtpConfig.getSmtpPass()
          }
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>'
        },
        template: {
          dir: resolve('src', 'infrastructure', 'views', 'mails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [EnvironmentConfigService]
    }),
    EnvironmentConfigModule
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
