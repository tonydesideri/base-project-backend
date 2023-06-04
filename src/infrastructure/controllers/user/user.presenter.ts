import { ApiProperty } from '@nestjs/swagger';
import { UserM } from 'src/domain/model/user';

export class UserPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  createdate: Date;
  @ApiProperty()
  updateddate: Date;
  @ApiProperty()
  lastLogin: Date;

  constructor(user: UserM) {
    this.id = user.id;
    this.username = user.username;
    this.createdate = user.createDate;
    this.updateddate = user.updatedDate;
  }
}