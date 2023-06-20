import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  readonly password: string;
}
