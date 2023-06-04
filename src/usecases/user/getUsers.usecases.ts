import { UserM } from 'src/domain/model/user'
import { UserRepository } from 'src/domain/repositories/userRepository.interface'

export class GetUsersUseCases {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserM[]> {
    return await this.userRepository.getAll()
  }
}
