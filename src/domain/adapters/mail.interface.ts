export interface IMail {
  to: string
  subject: string
  body: string
}

export interface IMailService {
  sendMail(mail: IMail): Promise<void>
}
