import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMail, IMailService } from 'src/domain/adapters/mail.interface';

@Injectable()
export class MailService implements IMailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(mail: IMail) {
    await this.mailerService.sendMail({
      to: mail.to,
      subject: mail.subject,
      template: mail.template,
      context: {
        email: mail.context.email,
        link: mail.context.link
      }
    });
  }
}
