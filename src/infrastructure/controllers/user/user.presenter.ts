import { ApiProperty } from '@nestjs/swagger';
import { UserM } from 'src/domain/model/user';

export class UserPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdate: Date;

  @ApiProperty()
  updateddate: Date;

  @ApiProperty()
  lastLogin: Date;

  @ApiProperty()
  isVerifiedEmail: boolean;

  constructor(user: UserM) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdate = user.createDate;
    this.updateddate = user.updatedDate;
    this.lastLogin = user.lastLogin;
    this.isVerifiedEmail = user.isVerifiedEmail;
  }
}
