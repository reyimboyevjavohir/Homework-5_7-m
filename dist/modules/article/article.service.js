"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./entities/article.entity");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
let ArticleService = class ArticleService {
    constructor(articleRepo) {
        this.articleRepo = articleRepo;
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
            },
        });
    }
    async uploadFile(file) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `articles/${(0, uuid_1.v4)()}.${fileExtension}`;
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
        return `${process.env.R2_PUBLIC_URL}/${fileName}`;
    }
    async create(createArticleDto, userId, file) {
        let imageUrl;
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
    async findAll() {
        return await this.articleRepo.find({ relations: ['user'] });
    }
    async findOne(id) {
        const article = await this.articleRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!article)
            throw new common_1.NotFoundException(`Article #${id} topilmadi`);
        return article;
    }
    async update(id, updateArticleDto, file) {
        const article = await this.findOne(id);
        let imageUrl = article.imageUrl;
        if (file) {
            imageUrl = await this.uploadFile(file);
        }
        await this.articleRepo.update(id, { ...updateArticleDto, imageUrl });
        return { message: 'Article updated successfully' };
    }
    async remove(id) {
        const article = await this.findOne(id);
        await this.articleRepo.delete(id);
        return { message: 'Article deleted successfully' };
    }
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticleService);
//# sourceMappingURL=article.service.js.map