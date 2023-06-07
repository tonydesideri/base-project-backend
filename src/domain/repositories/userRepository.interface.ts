import { UserM } from '../model/user'

export interface IUserRepository {
  insert(todo: UserM): Promise<UserM>
  getAll(): Promise<UserM[]>
  getById(id: number): Promise<UserM>
  getUserByEmail(email: string): Promise<UserM>
  updateLastLogin(email: string): Promise<void>
  updateRefreshToken(email: string, refreshToken: string): Promise<void>
  updateForgotPasswordToken(
    email: string,
    forgotPasswordToken: string,
  ): Promise<void>
  updatePasswordAndInvalidForgotPasswordToken(
    email: string,
    hashPassword: string,
  ): Promise<void>
}
