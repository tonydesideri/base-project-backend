import { UserM, UserWithoutPassword } from '../../domain/model/user'
import { IUserRepository } from '../../domain/repositories/userRepository.interface'

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: IUserRepository) {}

  async execute(email: string): Promise<UserWithoutPassword> {
    const user: UserM = await this.adminUserRepo.getUserByEmail(email)
    const { password, ...info } = user
    return info
  }
}
