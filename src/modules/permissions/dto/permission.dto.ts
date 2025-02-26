import { BaseType } from "@/modules/base/dto/base.dto";
import { PaginationResponse } from "@/modules/base/dto/pagination.response";
import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";

@ObjectType()
@ArgsType()
export class PermissionType extends BaseType {
  @Field()
  name: string;

  @Field()
  method: string;

  @Field()
  module: string;
}
@ObjectType()
export class PermissionTypeToValidate extends BaseType {
  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  method?: string;

  @Field({nullable: true})
  module?: string;
}

@ObjectType()
export class PermissionPaginationResponse extends PaginationResponse {
  @Field(() => [PermissionType])
  data: PermissionType[]; // The list of items in the current page
}
