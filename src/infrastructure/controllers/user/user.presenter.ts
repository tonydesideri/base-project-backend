import { ApiProperty } from '@nestjs/swagger';
import { UserM } from 'src/domain/model/user';

export class UserPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  createdate: Date;
  @ApiProperty()
  updateddate: Date;
  @ApiProperty()
  lastLogin: Date;
  @ApiProperty()
  hashRefreshToken: string;

  constructor(user: UserM) {
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.createdate = user.createDate;
    this.updateddate = user.updatedDate;
    this.hashRefreshToken = user.hashRefreshToken;
  }
}