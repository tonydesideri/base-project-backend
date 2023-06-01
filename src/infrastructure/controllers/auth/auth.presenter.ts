import { ApiProperty } from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/domain/model/user';

export class IsAuthPresenter {
  @ApiProperty()
  username: string;
}
