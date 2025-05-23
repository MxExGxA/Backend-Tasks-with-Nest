import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  parentCategoryId?: number;
}
