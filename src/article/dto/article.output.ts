import { Field, ObjectType } from '@nestjs/graphql';
import { ArticleAuthorOutput } from './article-author.output';

@ObjectType()
export class ArticleOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  caption?: string;

  @Field(() => String, { nullable: true })
  excerpt?: string;

  @Field(() => String)
  content: string;

  @Field(() => ArticleAuthorOutput)
  author: ArticleAuthorOutput;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
