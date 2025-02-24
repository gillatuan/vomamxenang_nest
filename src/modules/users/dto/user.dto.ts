// user.dto.ts
import { BaseType } from "@/modules/base/dto/base.dto";
import { PaginationResponse } from "@/modules/base/dto/pagination.response";
import { Field, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export enum RoleEnum {
  Admin = "Admin",
  Member = "Member",
}

@ObjectType()
export class UserType extends BaseType {
  @Field()
  email: string;

  @Field()
  password?: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field({ defaultValue: "", nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ defaultValue: false, nullable: true })
  isActive?: boolean;

  @Field({ defaultValue: false, nullable: true })
  isDeleted?: boolean;

  @Field()
  codeId: string;

  @Field()
  codeExpired: Date;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class UserPaginationResponse extends PaginationResponse {
  @Field(() => [UserType])
  data: UserType[]; // The list of items in the current page
}
