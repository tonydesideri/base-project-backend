import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthLoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly email: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string
}

export class ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly email: string
}

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string
}
