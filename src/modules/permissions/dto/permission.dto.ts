import { BaseType } from "@/modules/base/dto/base.dto";
import { PaginationResponse } from "@/modules/base/dto/pagination.response";
import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";

@ObjectType()
@ArgsType()
export class PermissionType extends BaseType {
  @Field({nullable: true})
  name?: string;

  @Field()
  @IsNotEmpty({ message: "method không được để trống" })
  method: string;

  @Field()
  @IsNotEmpty({ message: "module không được để trống" })
  module: string;
}

@ObjectType()
export class PermissionPaginationResponse extends PaginationResponse {
  @Field(() => [PermissionType])
  data: PermissionType[]; // The list of items in the current page
}
