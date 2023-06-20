import { ApiProperty } from '@nestjs/swagger';

export class IsAuthPresenter {
  @ApiProperty()
  email: string;
}

export class IsForgotPasswprdPresenter {
  @ApiProperty()
  message: string;
}
