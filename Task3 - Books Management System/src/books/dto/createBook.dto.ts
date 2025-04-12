import { IsDateString, IsString, Length } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsString()
  @Length(3, 100)
  author: string;

  @IsDateString()
  publishedDate: string;
}
