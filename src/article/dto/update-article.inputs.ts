import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateArticleOutput {
  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(60)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  caption?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  content?: string;
}
