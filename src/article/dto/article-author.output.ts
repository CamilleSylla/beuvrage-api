import { ObjectType, OmitType } from '@nestjs/graphql';
import { UserOutput } from 'src/user/dto/user.output';

@ObjectType()
export class ArticleAuthorOutput extends OmitType(UserOutput, [
  'role',
] as const) {}
