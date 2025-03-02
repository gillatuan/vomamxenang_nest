// user.dto.ts
import { BaseType } from "@/base/dto/base.dto";
import { GraphQLResponse } from "@/base/dto/graphql-response.dto";
import { PaginationResponse } from "@/base/dto/pagination.response";
import { Role } from "@/modules/roles/entities/role.entity";
// import { RoleType } from "@/roles/dto/role.dto";
import { Field, ObjectType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { ManyToOne } from "typeorm";

export enum RoleEnum {
  SuperAdmin = "SUPER_ADMIN",
  Admin = "ADMIN",
  Member = "MEMBER",
}

@ObjectType()
export class UserType {
  @Field({ nullable: true })
  id?: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field({ defaultValue: "", nullable: true })
  avatar?: string;

/*   @Field(() => Role, {nullable: true})
  @IsOptional()
  role?: Role; */

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
@ObjectType()
export class UserPaginationResponseInterceptor extends GraphQLResponse.forType(
  UserPaginationResponse
) {}

@ObjectType()
export class UserResponse extends GraphQLResponse.forType(UserType) {}
