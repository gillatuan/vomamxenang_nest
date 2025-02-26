import { CreatePermissionInput } from "@/modules/permissions/dto/create-permission.input";
import { Field, InputType, PartialType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  method?: string;

  @Field({ nullable: true })
  module?: string;
}
