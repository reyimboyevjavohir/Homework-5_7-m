import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ArticleFileDto {
  @ApiProperty({ example: 'My First Article', description: 'Maqola sarlavhasi' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Bu mening birinchi maqolam...', description: 'Maqola matni' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
