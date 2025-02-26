import { ResponseMessage, GqlCurrentUser } from "@/helpers/customize";
import { GraphQLTransformInterceptor } from "@/lib/graphql.transform.interceptor";
import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IUser } from "../users/entities/users";
import { CreateRoleInput } from "./dto/create-role.input";
import {
  RolePaginationResponse,
  RolePaginationResponseInterceptor,
  RoleResponse,
  RoleType,
} from "./dto/role.dto";
import { UpdateRoleInput } from "./dto/update-role.input";
import { Role } from "./entities/role.entity";
import { RolesService } from "./roles.service";

@UseInterceptors(GraphQLTransformInterceptor<RoleType>)
@Resolver(() => RoleType)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => RolePaginationResponseInterceptor, { name: "findAllRoles" })
  findAll(
    @Args("qs", { nullable: true }) qs?: string
  ): Promise<RolePaginationResponse> {
    return this.rolesService.findAll(qs);
  }

  @Mutation(() => RoleType, { name: "createRole" })
  @ResponseMessage("Create a new permission")
  create(
    @Args("createRoleInput") createRoleInput: CreateRoleInput,
    @GqlCurrentUser() currentUser: IUser
  ) {
    return this.rolesService.create(createRoleInput, currentUser);
  }

  @Mutation(() => RoleResponse, { name: "updateRole" })
  async updateItem(
    @Args("id") id: string,
    @Args("updateItemInput") updateItemInput: UpdateRoleInput,
    @GqlCurrentUser() currentUser: IUser
  ) {
    return await this.rolesService.updateItem(id, updateItemInput, currentUser);
  }
}
