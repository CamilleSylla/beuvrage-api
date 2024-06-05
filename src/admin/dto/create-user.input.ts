import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { RoleList } from "src/role/entity/role.enum";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsString()
    firstName: string
    
    @Field(() => String)
    @IsString()
    lastName: string

    @Field(() => String, {nullable: true})
    @IsEmail()
    email: string
    
    @Field(() => String, {nullable: true})
    @IsOptional()
    @IsEnum(RoleList, {each: true})
    role?: RoleList[]
    
}