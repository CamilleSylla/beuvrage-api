import { Field, ObjectType } from "@nestjs/graphql";
import { RoleEntity } from "../entity/role.entity";
import { RoleList } from "../entity/role.enum";

@ObjectType()
export class RoleOutput {

    @Field(() => String)
    id: string;

    @Field(() => RoleList)
    name: RoleList
}