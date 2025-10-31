import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsISBN,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  genre?: string;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}

