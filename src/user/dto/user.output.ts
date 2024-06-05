import { Field, ObjectType } from "@nestjs/graphql";
import { RoleList } from "src/role/entity/role.enum";

@ObjectType()
export class UserOutput {
    @Field(() => String)
    id: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;
   
    @Field(() => String)
    email: string;

    @Field(() => RoleList)
    role: RoleList
}