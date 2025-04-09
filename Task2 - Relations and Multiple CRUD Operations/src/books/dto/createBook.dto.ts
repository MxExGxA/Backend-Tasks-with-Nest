import { IsDateString, IsString, Length } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsDateString()
  publishedDate: string;
}
