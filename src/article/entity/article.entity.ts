import { Field } from '@nestjs/graphql';
import { UsersEntity } from 'src/user/entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  caption?: string;

  @Field(() => String, { nullable: true })
  excerpt?: string;

  @Field(() => String)
  content: string;

  @ManyToOne(() => UsersEntity, (user) => user.articles)
  author: UsersEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
