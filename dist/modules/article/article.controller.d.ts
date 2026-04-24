import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    create(createArticleDto: CreateArticleDto, req: any, file?: Express.Multer.File): Promise<import("./entities/article.entity").Article>;
    findAll(): Promise<import("./entities/article.entity").Article[]>;
    findOne(id: number): Promise<import("./entities/article.entity").Article>;
    update(id: number, updateArticleDto: UpdateArticleDto, file?: Express.Multer.File): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
