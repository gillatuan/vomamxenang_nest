import { GqlCurrentUser, Public, ResponseMessage } from '@/helpers/customize';
import { GraphQLTransformInterceptor } from '@/lib/graphql.transform.interceptor';
import { RegisterUserInput } from '@/modules/users/dto/create-user.input';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserPaginationResponse, UserPaginationResponseInterceptor, UserResponse, UserType } from './dto/user.dto';
import { IUser } from './entities/users.d';

@UseInterceptors(GraphQLTransformInterceptor<UserType>)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserResponse)
  @Public()
  helloo() {
    return {
      email: "User Hello World",
    };
  }

  @Mutation(() => UserResponse, { name: 'registerUser' })
  @ResponseMessage('Register User')
  async registerUser(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
    @GqlCurrentUser() currentUser: IUser,
  ): Promise<UserType> {
    return await this.usersService.register(registerUserInput, currentUser);
  }

  @Query(() => UserPaginationResponseInterceptor, { name: "findAllUsers1" })
  findAll(
    @Args("qs", { nullable: true }) qs?: string
  ): Promise<UserPaginationResponse> {
    return this.usersService.findAll(qs);
  }
}
