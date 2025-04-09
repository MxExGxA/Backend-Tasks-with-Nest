import { IsDateString, IsString, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsDateString()
  birthDate: string;
}
