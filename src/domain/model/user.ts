export class UserWithoutPassword {
  id: number;
  name: string;
  email: string;
  isVerifiedEmail: boolean;
  createDate: Date;
  updatedDate: Date;
  lastLogin: Date;
  hashRefreshToken: string;
  hashForgotPasswordToken: string;
}

export class UserM extends UserWithoutPassword {
  password: string;
}
