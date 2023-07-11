import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class AddUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    const words = value.split(' ');
    const capitalizedWords = words.map(
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(' ');
  })
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

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

export class EmailConfirmationUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  token: string;
}
