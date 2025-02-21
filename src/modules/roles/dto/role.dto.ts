import { PermissionType } from "@/modules/permissions/dto/permission.dto";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoleType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  isActive: boolean;

  @Field(() => [PermissionType], { defaultValue: [] }) // ✅ Explicitly define the GraphQL type
  permissions: PermissionType[];
}
