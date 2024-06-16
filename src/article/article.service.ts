import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleInput } from './dto/create-article.input';
import { plainToInstance } from 'class-transformer';
import { UserService } from 'src/user/user.service';
import { UpdateArticleOutput } from './dto/update-article.inputs';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly userService: UserService,
  ) {}

  async createArticle(userId: string, inputs: CreateArticleInput) {
    this.logger.log(`article.create : user ${userId} is creating an article`);
    const articleInstance = plainToInstance(ArticleEntity, {
      ...inputs,
      author: { id: userId },
    });
    return await this.articleRepository.save(articleInstance);
  }

  async getArticleById(id: string) {
    return await this.articleRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async updateArticleById(
    id: string,
    userId: string,
    inputs: UpdateArticleOutput,
  ) {
    this.logger.log(
      `article.create : user ${userId} is updating article ${id}`,
    );
    await this.articleRepository.update({ id }, inputs);
    return await this.getArticleById(id);
  }

  async getAuthorByArticleId(id: string) {
    const { author } = await this.getArticleById(id);
    const user = await this.userService.getUserById(author.id);
    return user;
  }
}
