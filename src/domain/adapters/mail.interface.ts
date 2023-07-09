interface ResetPasswordTemplate {
  email: string;
  link: string;
}

interface PasswordChangedTemplate {
  link: string;
}

interface EmailConfirmationTemplate {
  confirmationLink: string;
}

type TemplateType =
  | 'reset-password'
  | 'password-changed'
  | 'email-confirmation';

type TemplateContextMap = {
  'reset-password': ResetPasswordTemplate;
  'password-changed': PasswordChangedTemplate;
  'email-confirmation': EmailConfirmationTemplate;
};

export interface IMail<T extends TemplateType = TemplateType> {
  to: string;
  subject: string;
  template: T;
  context: TemplateContextMap[T];
}

export interface IMailService {
  sendMail<T extends TemplateType = TemplateType>(
    mail: IMail<T>
  ): Promise<void>;
}
