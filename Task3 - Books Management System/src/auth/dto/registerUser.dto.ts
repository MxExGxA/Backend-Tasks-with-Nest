import { IsString, Length, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(3, 100)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
