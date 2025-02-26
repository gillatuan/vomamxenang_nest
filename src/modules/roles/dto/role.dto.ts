import { BaseType } from "@/modules/base/dto/base.dto";
import { GraphQLResponse } from "@/modules/base/dto/graphql-response.dto";
import { PaginationResponse } from "@/modules/base/dto/pagination.response";
import { PermissionType } from "@/modules/permissions/dto/permission.dto";
import { Permission } from "@/modules/permissions/entities/permission.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { ManyToOne } from "typeorm";

@ObjectType()
export class RoleType extends BaseType {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  isActive: boolean;

  @Field(() => [PermissionType], { defaultValue: [] }) // ✅ Explicitly define the GraphQL type
  permissions: {
    id: string;
    name: string;
  }[];
}

@ObjectType()
export class RolePaginationResponse extends PaginationResponse {
  @Field(() => [RoleType])
  data: RoleType[]; // The list of items in the current page
}
@ObjectType()
export class RolePaginationResponseInterceptor extends GraphQLResponse.forType(
  RolePaginationResponse
) {}

@ObjectType()
export class RoleResponse extends GraphQLResponse.forType(RoleType) {}
