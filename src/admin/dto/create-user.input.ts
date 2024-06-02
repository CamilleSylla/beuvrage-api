import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ObjectType()
export class CreateUser {
    @Field(() => String)
    @IsString()
    firstName: string
    
    @Field(() => String)
    @IsString()
    lastName: string
}