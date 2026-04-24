import { BaseEntity } from 'src/database/entities/base.entiy';
import { Auth } from 'src/modules/auth/entities/auth.entity';
export declare class Article extends BaseEntity {
    title: string;
    content: string;
    imageUrl?: string;
    userId?: number;
    user?: Auth;
}
