import { ResponseMessage, User } from '@/decorator/customize';
import { Public } from '@/helpers/setPubicPage';
import { Args, Mutation, Resolver , Query} from '@nestjs/graphql';
import { IUser } from '../users/entities/users';
import { CreatePermissionInput } from './dto/create-permission.input';
import { PermissionPaginationResponse, PermissionType } from './dto/permission.dto';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';

@Resolver(() => PermissionType)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Query(() => String)
  @Public()
  async helloPermissions() {
    return await 'hello Permissions ';
  }

  @Mutation(() => PermissionType, { name: 'createPermission' })
  @ResponseMessage('Create a new permission')
  create(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
    @User() user: IUser,
  ) {
    return this.permissionsService.create(createPermissionInput, user);
  }

  @Query(() => PermissionPaginationResponse, { name: 'listPermissions' })
  @ResponseMessage('Fetch permissions with paginate')
  findAll(
    @Args('qs', { nullable: true }) qs?: string,
  ): Promise<PermissionPaginationResponse> {
    return this.permissionsService.findAll(qs);
  }

  /* @Get(':id')
  @ResponseMessage("Fetch a permission by id")
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a permission")
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a permission")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  } */
}
