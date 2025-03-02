import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { GraphQLTransformInterceptor } from '@/lib/graphql.transform.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { GqlCurrentUser, ResponseMessage } from '@/helpers/customize';
import { IUser } from '../users/entities/users';
import { RoleResponse, RoleType } from './dto/role.dto';

@UseInterceptors(GraphQLTransformInterceptor<Role>)
@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => RoleResponse, { name: "createRole" })
  @ResponseMessage("Create a new permission")
  create(
    @Args("createRoleInput") createRoleInput: CreateRoleInput,
    @GqlCurrentUser() currentUser: IUser
  ): Promise<Role> {
    return this.rolesService.create(createRoleInput, currentUser);
  }
}
