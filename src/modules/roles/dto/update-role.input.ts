import { Field, InputType, OmitType, PartialType } from "@nestjs/graphql";
import { CreateRoleInput } from "./create-role.input";
import { RoleType } from "./role.dto";

@InputType()
export class UpdateRoleInput extends OmitType(PartialType(RoleType), ['id']) {
  @Field()
  id: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
}
