import { ApiProperty } from '@nestjs/swagger';

export class ArticleResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty()
  createdAt!: Date;
}
