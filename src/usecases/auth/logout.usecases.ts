import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class LogoutUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<string[]> {
    await this.userRepository.invalidateRefreshToken(email);
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }
}
