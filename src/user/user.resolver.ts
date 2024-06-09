import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class UserResolver {
  @Query(() => String)
  getUser() {
    return "hello";
  }
}
