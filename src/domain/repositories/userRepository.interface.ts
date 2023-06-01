import { UserM } from '../model/user';

export interface UserRepository {
  insert(todo: UserM): Promise<UserM>;
  findAll(): Promise<UserM[]>;
  findById(id: number): Promise<UserM>;
  getUserByUsername(username: string): Promise<UserM>;
  updateLastLogin(username: string): Promise<void>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
}
