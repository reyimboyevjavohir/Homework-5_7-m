import { BaseEntity } from 'src/database/entities/base.entiy';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Auth } from 'src/modules/auth/entities/auth.entity';

@Entity({ name: 'article' })
export class Article extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => Auth, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: Auth;
}
