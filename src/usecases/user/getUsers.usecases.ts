import { UserM } from 'src/domain/model/user'
import { IUserRepository } from 'src/domain/repositories/userRepository.interface'

export class GetUsersUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserM[]> {
    return await this.userRepository.getAll()
  }
}
