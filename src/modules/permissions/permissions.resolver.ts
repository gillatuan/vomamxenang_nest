import { GqlCurrentUser, Public, ResponseMessage } from "@/decorator/customize";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FilterDto } from "../base/dto/filter.dto";
import { IUser } from "../users/entities/users";
import { CreatePermissionInput } from "./dto/create-permission.input";
import {
  PermissionPaginationResponse,
  PermissionType,
} from "./dto/permission.dto";
import { UpdatePermissionInput } from "./dto/update-permission.input";
import { PermissionsService } from "./permissions.service";

@Resolver(() => PermissionType)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Query(() => String)
  @Public()
  async helloPermissions() {
    return await "hello Permissions ";
  }

  @Query(() => PermissionPaginationResponse, { name: "listPermissions" })
  @ResponseMessage("Fetch permissions with paginate")
  findAll(
    @Args("qs", { nullable: true }) qs?: string
  ): Promise<PermissionPaginationResponse> {
    return this.permissionsService.findAll(qs);
  }

  @Query(() => PermissionPaginationResponse, {
    name: "searchTermOfPermissions",
  })
  searchTerms(
    @Args("filterDto") filterDto: FilterDto
  ): Promise<PermissionPaginationResponse> {
    // const regex = `email=/${filterDto.s}/&skip=0&limit=10&sort=-1`
    const regex = filterDto.s;
    return this.permissionsService.searchTerms(regex);
  }

  @Mutation(() => PermissionType, { name: "createPermission" })
  @ResponseMessage("Create a new permission")
  create(
    @Args("createPermissionInput") createPermissionInput: CreatePermissionInput,
    @GqlCurrentUser() currentUser: IUser
  ) {
    return this.permissionsService.create(createPermissionInput, currentUser);
  }

  @Mutation(() => PermissionType, { name: "updatePermission" })
  async updateItem(
    @Args("id") id: string,
    @Args("updateItemInput") updateItemInput: UpdatePermissionInput,
    @GqlCurrentUser() currentUser: IUser
  ): Promise<UpdatePermissionInput | false> {
    return await this.permissionsService.updateItem(
      id,
      updateItemInput,
      currentUser
    );
  }

  @Mutation(() => PermissionType, { name: "deletePermission" })
  @ResponseMessage("Delete a User")
  remove(@Args("id") id: string, @GqlCurrentUser() currentUser: IUser) {
    const resp = this.permissionsService.remove(id, currentUser);
    if (resp) {
      this.findAll();
    }
  }
}
