// import { CreateRoleInput } from "@/modules/roles/dto/create-role.input";
import {
  ArgsType,
  Field,
  InputType,
  OmitType,
  PartialType,
} from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { UserType } from "./user.dto";

@InputType()
@ArgsType()
export class UpdateUserInput extends OmitType(
  PartialType(UserType),
  [] as const
) {
  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  password?: string;
}
