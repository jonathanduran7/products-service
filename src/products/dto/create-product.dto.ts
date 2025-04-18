import { IsString, IsNumber, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @MinLength(10)
  description: string;
} 