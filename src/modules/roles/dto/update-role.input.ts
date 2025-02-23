import { CreatePermissionInput } from "@/modules/permissions/dto/create-permission.input";
import { PermissionType } from "@/modules/permissions/dto/permission.dto";
import { UpdatePermissionInput } from "@/modules/permissions/dto/update-permission.input";
import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateRoleInput } from "./create-role.input";

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  isActive: boolean;

  @Field(() => [CreatePermissionInput], { defaultValue: [], nullable: true }) // ✅ Explicitly define the GraphQL type
  permissions: CreatePermissionInput[];
}
