import { ApiProperty } from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/domain/model/user';

export class IsAuthPresenter {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isVerifiedEmail: boolean;

  constructor(user: UserWithoutPassword) {
    this.name = user.name;
    this.email = user.email;
    this.isVerifiedEmail = user.isVerifiedEmail;
  }
}

export class IsForgotPasswprdPresenter {
  @ApiProperty()
  message: string;
}
