import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UserOutput } from 'src/user/dto/user.output';
import { AdminUserService } from './admin-user.service';

@Resolver()
export class AdminUserResolver {

    constructor(private readonly adminUserService: AdminUserService){}

    @Mutation(() => UserOutput)
    async adminCreateUser (@Args('user', {type: () => CreateUserInput}) user: CreateUserInput){
        return await this.adminUserService.createUser(user)
    }
}
