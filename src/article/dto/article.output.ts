import { Field, ObjectType } from '@nestjs/graphql';
import { UserOutput } from 'src/user/dto/user.output';

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

  @Field(() => UserOutput)
  author: UserOutput;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
