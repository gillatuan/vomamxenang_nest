import { BaseType } from '@/base/dto/base.dto';
import { GraphQLResponse } from '@/base/dto/graphql-response.dto';
import { PaginationResponse } from '@/base/dto/pagination.response';
import { User } from '@/modules/users/entities/user.entity';
// import { PermissionTypeToValidate } from "@/modules/permissions/dto/permission.dto";
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, OneToMany } from 'typeorm';

@ObjectType()
export class RoleType extends BaseType {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  isActive: boolean;

  @OneToMany(() => User, (user) => user.role, { cascade: true })
  @Field(() => [User], { nullable: true })
  users?: User[];

  /*   @Field(() => [PermissionTypeToValidate], { defaultValue: [] }) // ✅ Explicitly define the GraphQL type
  permissions: {
    id: string;
    name: string;
  }[]; */
}

@ObjectType()
export class RolePaginationResponse extends PaginationResponse {
  @Field(() => [RoleType])
  data: RoleType[]; // The list of items in the current page
}
@ObjectType()
export class RolePaginationResponseInterceptor extends GraphQLResponse.forType(
  RolePaginationResponse,
) {}

@ObjectType()
export class RoleResponse extends GraphQLResponse.forType(RoleType) {}
