import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { ArticleOutput } from './dto/article.output';
import { CreateArticleInput } from './dto/create-article.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gqlAuth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAccessClaims } from 'src/auth/types/jwt';
import { UserOutput } from 'src/user/dto/user.output';
import { UpdateArticleOutput } from './dto/update-article.inputs';

@Resolver(() => ArticleOutput)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => ArticleOutput)
  @UseGuards(GqlAuthGuard)
  async createArticle(
    @Args('inputs', { type: () => CreateArticleInput })
    inputs: CreateArticleInput,
    @CurrentUser() user: JwtAccessClaims,
  ) {
    return await this.articleService.createArticle(user.id as string, inputs);
  }

  @Mutation(() => ArticleOutput)
  @UseGuards(GqlAuthGuard)
  async updateArticleById(
    @Args('articleId', { type: () => String }) articleId: string,
    @Args('inputs', { type: () => UpdateArticleOutput })
    inputs: UpdateArticleOutput,
    @CurrentUser() user: JwtAccessClaims,
  ) {
    const { id } = user;
    return await this.articleService.updateArticleById(
      articleId,
      id as string,
      inputs,
    );
  }
  @ResolveField(() => UserOutput, { name: 'author' })
  async resolveAuthor(
    @Parent()
    article: ArticleOutput,
  ) {
    const { id } = article;
    return await this.articleService.getAuthorByArticleId(id);
  }
}
