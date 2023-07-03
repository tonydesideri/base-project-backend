import { IException } from 'src/domain/adapters/exceptions.interface';
import { ILoggerService } from 'src/domain/adapters/logger.interface';
import { postgresErrorCode } from 'src/infrastructure/common/constants/postgres.constant';
import { userErrorMessages } from 'src/infrastructure/common/constants/user.contant';
import { UserM } from '../../domain/model/user';
import { IUserRepository } from './../../domain/repositories/userRepository.interface';
const bcrypt = require('bcrypt');

export class AddUserUseCases {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userRepository: IUserRepository,
    private readonly exceptionService: IException
  ) {}

  async execute(name: string, email: string, password: string): Promise<UserM> {
    try {
      const user = new UserM();
      user.name = name;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);
      const result = await this.userRepository.insert(user);
      this.logger.log('addUserUseCases execute', 'New User have been inserted');
      return result;
    } catch (error) {
      this.logger.log('addUserUseCases execute', 'Error insert new User');
      if (error?.code === postgresErrorCode.UNIQUE_VIOLATION) {
        this.exceptionService.BadRequestException({
          message: userErrorMessages.EMAIL_ALREADY_EXISTS
        });
      }
      return error;
    }
  }
}
