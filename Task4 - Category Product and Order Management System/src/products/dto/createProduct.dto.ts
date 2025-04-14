import { ArrayNotEmpty, IsArray, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  categories: number[];
}
