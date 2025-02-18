import { ResponseMessage, User } from '@/decorator/customize';
import { Public } from '@/helpers/setPubicPage';
import { Args, Mutation, Resolver , Query} from '@nestjs/graphql';
import { FilterDto } from '../base/dto/filter.dto';
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

  @Query(() => PermissionPaginationResponse, { name: 'searchTermPermissions' })
  searchTerms(
    @Args('filterDto') filterDto: FilterDto,
  ): Promise<PermissionPaginationResponse> {
    // const regex = `email=/${filterDto.s}/&skip=0&limit=10&sort=-1`
    const regex = filterDto.s
    return this.permissionsService.searchTerms(regex);
  }
}
