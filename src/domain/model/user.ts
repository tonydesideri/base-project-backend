export class UserWithoutPassword {
  id: number
  email: string
  createDate: Date
  updatedDate: Date
  lastLogin: Date
  hashRefreshToken: string
  hashForgotPasswordToken: string
}

export class UserM extends UserWithoutPassword {
  password: string
}
