import { GqlCurrentUser } from "@/decorator/customize";
import { ResponseMessage } from "@/helpers/setPubicPage";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { IUser } from "../users/entities/users";
import { CreateRoleInput } from "./dto/create-role.input";
import { RoleType } from "./dto/role.dto";
import { UpdateRoleInput } from "./dto/update-role.input";
import { Role } from "./entities/role.entity";
import { RolesService } from "./roles.service";

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => RoleType, { name: "createRole" })
  @ResponseMessage("Create a new permission")
  create(
    @Args("createRoleInput") createRoleInput: CreateRoleInput,
    @GqlCurrentUser() currentUser: IUser
  ) {
    return this.rolesService.create(createRoleInput, currentUser);
  }

  @Mutation(() => RoleType, { name: "updateRole" })
  async updateItem(
    @Args("id") id: string,
    @Args("updateItemInput") updateItemInput: UpdateRoleInput,
    @GqlCurrentUser() currentUser: IUser
  ): Promise<UpdateRoleInput | false> {
    return await this.rolesService.updateItem(id, updateItemInput, currentUser);
  }
}
