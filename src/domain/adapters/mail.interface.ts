interface ResetPasswordTemplate {
  email: string;
  link: string;
}

interface PasswordChangedTemplate {
  link: string;
}

type TemplateType = 'reset-password' | 'password-changed';

type TemplateContextMap = {
  'reset-password': ResetPasswordTemplate;
  'password-changed': PasswordChangedTemplate;
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
