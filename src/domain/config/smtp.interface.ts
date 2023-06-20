export interface ISmtpConfig {
  getSmtpHost(): string;
  getSmtpPort(): number;
  getSmtpUser(): string;
  getSmtpPass(): string;
}
