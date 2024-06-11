import { InputType, OmitType } from "@nestjs/graphql";
import { AdminCreateUserInput } from "src/admin/dto/create-user.input";

@InputType()
export class CreateUserInput extends OmitType(AdminCreateUserInput, [
  "role",
] as const) {}
