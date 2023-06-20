import { IUserRepository } from './../../domain/repositories/userRepository.interface';
import { UserM } from '../../domain/model/user';
import { ILoggerService } from 'src/domain/adapters/logger.interface';
const bcrypt = require('bcrypt');

export class AddUserUseCases {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(email: string, password: string): Promise<UserM> {
    const user = new UserM();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    const result = await this.userRepository.insert(user);
    this.logger.log('addUserUseCases execute', 'New User have been inserted');
    return result;
  }
}
