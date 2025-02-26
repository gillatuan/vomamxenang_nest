import { CreateRoleInput } from "@/modules/roles/dto/create-role.input";
import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { RegisterUserInput } from "./create-user.input";

@InputType()
@ArgsType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {
  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => CreateRoleInput, { nullable: true })
  role?: {
    id: string;
    name: string;
  };
}
