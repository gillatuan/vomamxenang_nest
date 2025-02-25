import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { RegisterUserInput } from "./create-user.input";
import { RoleEnum } from "./user.dto";

@InputType()
@ArgsType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {
  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({nullable: true})
  @IsOptional()
  role?: RoleEnum;
}
