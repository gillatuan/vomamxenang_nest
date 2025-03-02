// import { CreateRoleInput } from "@/modules/roles/dto/create-role.input";
import { CreateRoleInput } from "@/modules/roles/dto/create-role.input";
import { Role } from "@/modules/roles/entities/role.entity";
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
}
