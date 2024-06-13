import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleInput } from './dto/create-article.input';
import { plainToInstance } from 'class-transformer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly userService: UserService,
  ) {}

  async createArticle(userId: string, inputs: CreateArticleInput) {
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

  async getAuthorByArticleId(id: string) {
    const { author } = await this.getArticleById(id);
    const user = await this.userService.getUserById(author.id);
    return user;
  }
}
