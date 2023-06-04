import { UserM } from '../model/user'

export interface UserRepository {
  insert(todo: UserM): Promise<UserM>
  getAll(): Promise<UserM[]>
  getById(id: number): Promise<UserM>
  getUserByUsername(username: string): Promise<UserM>
  updateLastLogin(username: string): Promise<void>
  updateRefreshToken(username: string, refreshToken: string): Promise<void>
}
