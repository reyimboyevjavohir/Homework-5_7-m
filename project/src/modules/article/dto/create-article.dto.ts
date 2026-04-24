import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'My First Article' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Maqola matni...' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional()
  @IsOptional()
  imageUrl?: string;
}
