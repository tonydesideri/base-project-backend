import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserM } from '../../domain/model/user';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class DatabaseUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>
  ) {}

  async insert(user: UserM): Promise<UserM> {
    const userEntity = this.toUserEntity(user);
    const result = await this.userEntityRepository.insert(userEntity);
    return this.toUser(result.generatedMaps[0] as User);
  }

  async getAll(): Promise<UserM[]> {
    const usersEntity = await this.userEntityRepository.find();
    return usersEntity.map((usersEntity) => this.toUser(usersEntity));
  }

  async getById(id: number): Promise<UserM> {
    const userEntity = await this.userEntityRepository.findOneOrFail({
      where: {
        id
      }
    });
    return this.toUser(userEntity);
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.userEntityRepository.update(
      {
        email
      },
      { hach_refresh_token: refreshToken }
    );
  }

  async getUserByEmail(email: string): Promise<UserM> {
    const adminUserEntity = await this.userEntityRepository.findOne({
      where: {
        email
      }
    });
    if (!adminUserEntity) {
      return null;
    }
    return this.toUser(adminUserEntity);
  }

  async updateLastLogin(email: string): Promise<void> {
    await this.userEntityRepository.update(
      {
        email
      },
      { last_login: () => 'CURRENT_TIMESTAMP' }
    );
  }

  async updateForgotPasswordToken(
    email: string,
    forgotPasswordToken: string
  ): Promise<void> {
    await this.userEntityRepository.update(
      {
        email
      },
      { hach_forgot_password_token: forgotPasswordToken }
    );
  }

  async updatePasswordAndInvalidForgotPasswordToken(
    email: string,
    hashPassword: string
  ): Promise<void> {
    await this.userEntityRepository.update(
      {
        email
      },
      {
        password: hashPassword,
        hach_forgot_password_token: null
      }
    );
  }

  async invalidRefreshToken(email: string): Promise<void> {
    await this.userEntityRepository.update(
      {
        email
      },
      {
        hach_refresh_token: null
      }
    );
  }

  private toUser(adminUserEntity: User): UserM {
    const adminUser: UserM = new UserM();

    adminUser.id = adminUserEntity.id;
    adminUser.name = adminUserEntity.name;
    adminUser.email = adminUserEntity.email;
    adminUser.password = adminUserEntity.password;
    adminUser.isVerifiedEmail = adminUserEntity.is_verified_email;
    adminUser.createDate = adminUserEntity.createdate;
    adminUser.updatedDate = adminUserEntity.updateddate;
    adminUser.lastLogin = adminUserEntity.last_login;
    adminUser.hashRefreshToken = adminUserEntity.hach_refresh_token;
    adminUser.hashForgotPasswordToken =
      adminUserEntity.hach_forgot_password_token;

    return adminUser;
  }

  private toUserEntity(adminUser: UserM): User {
    const adminUserEntity: User = new User();

    adminUserEntity.email = adminUser.email;
    adminUserEntity.name = adminUser.name;
    adminUserEntity.password = adminUser.password;
    adminUserEntity.is_verified_email = adminUser.isVerifiedEmail;
    adminUserEntity.last_login = adminUser.lastLogin;

    return adminUserEntity;
  }
}
