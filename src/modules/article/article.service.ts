import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArticleService {
  private s3Client: S3Client;

  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {
    // Cloudflare R2 configuration
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `articles/${uuidv4()}.${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
  }

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<Article> {
    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.uploadFile(file);
    }

    const article = this.articleRepo.create({
      ...createArticleDto,
      userId,
      imageUrl,
    });

    return await this.articleRepo.save(article);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!article) throw new NotFoundException(`Article #${id} topilmadi`);
    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<{ message: string }> {
    const article = await this.findOne(id);

    let imageUrl = article.imageUrl;
    if (file) {
      imageUrl = await this.uploadFile(file);
    }

    await this.articleRepo.update(id, { ...updateArticleDto, imageUrl });
    return { message: 'Article updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const article = await this.findOne(id);
    await this.articleRepo.delete(id);
    return { message: 'Article deleted successfully' };
  }
}
