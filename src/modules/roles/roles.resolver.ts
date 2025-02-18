import { GqlCurrentUser } from "@/decorator/customize";
import { ResponseMessage } from "@/helpers/setPubicPage";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { IUser } from "../users/entities/users";
import { CreateRoleInput } from "./dto/create-role.input";
import { RoleType } from "./dto/role.dto";
import { Role } from "./entities/role.entity";
import { RolesService } from "./roles.service";

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => RoleType, { name: "createRole" })
  @ResponseMessage("Create a new permission")
  create(
    @Args("createItemInput") createItemInput: CreateRoleInput,
    @GqlCurrentUser() currentUser: IUser
  ) {
    return this.rolesService.create(createItemInput, currentUser);
  }
}
