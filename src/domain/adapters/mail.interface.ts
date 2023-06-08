export interface IMail {
  to: string
  subject: string
  body: string
  template: 'reset-password'
  context: {
    [name: string]: any
  }
}

export interface IMailService {
  sendMail(mail: IMail): Promise<void>
}
