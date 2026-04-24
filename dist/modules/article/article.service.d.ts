import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticleService {
    private articleRepo;
    private s3Client;
    constructor(articleRepo: Repository<Article>);
    uploadFile(file: Express.Multer.File): Promise<string>;
    create(createArticleDto: CreateArticleDto, userId: number, file?: Express.Multer.File): Promise<Article>;
    findAll(): Promise<Article[]>;
    findOne(id: number): Promise<Article>;
    update(id: number, updateArticleDto: UpdateArticleDto, file?: Express.Multer.File): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
