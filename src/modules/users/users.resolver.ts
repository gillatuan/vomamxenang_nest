import { FilterDto } from "@/base/dto/filter.dto";
import { GqlCurrentUser, Public, ResponseMessage } from "@/helpers/customize";
import { GraphQLTransformInterceptor } from "@/lib/graphql.transform.interceptor";
import { RegisterUserInput } from "@/modules/users/dto/create-user.input";
import { User } from "@/modules/users/entities/user.entity";
import { UsersService } from "@/modules/users/users.service";
import { UseInterceptors } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UpdateUserInput } from "./dto/update-user.input";
import {
  UserPaginationResponse,
  UserPaginationResponseInterceptor,
  UserResponse,
  UserType,
} from "./dto/user.dto";
import { IUser } from "./entities/users.d";

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

  @Query(() => String)
  async me(@Context() context) {
    /* console.log('Request Object:', context.req); // ✅ Log full request
    console.log('Cookies:', context.req.cookies); // ✅ Check cookies

    const refreshToken = context.req.cookies?.refresh_token;
    
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    } */

    return `Me`;
    // return `Your refresh token: ${refreshToken}`;
  }

  @Mutation(() => UserResponse, { name: "registerUser" })
  @ResponseMessage("Register User")
  async registerUser(
    @Args("registerUserInput") registerUserInput: RegisterUserInput,
    @GqlCurrentUser() currentUser: IUser
  ): Promise<UserType> {
    return await this.usersService.register(registerUserInput, currentUser);
  }

  @Mutation(() => UserResponse, { name: "updateUser" })
  async updateUser(
    @Args("id") id: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput
  ): Promise<UserType> {
    return await this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => UserResponse, { name: "removeUser" })
  async removeUser(
    @Args("id") id: string,
    @GqlCurrentUser() currentUser
  ): Promise<UserType> {
    return await this.usersService.remove(id, currentUser);
  }

  @Query(() => UserResponse, { name: "findOneUser" })
  findOne(@Args("id") id: string): Promise<UserType> {
    return this.usersService.findOne({ id });
  }

  @Query(() => UserPaginationResponseInterceptor, { name: "findAllUsers" })
  findAll(
    @Args("qs", { nullable: true }) qs?: string
  ): Promise<UserPaginationResponse> {
    return this.usersService.findAll(qs);
  }

  @Query(() => UserPaginationResponseInterceptor, { name: "searchTermsOfUser" })
  searchTerms(
    @Args("filterDto") filterDto: FilterDto
  ): Promise<UserPaginationResponse> {
    // const regex = `email=/${filterDto.s}/&skip=0&limit=10&sort=-1`
    const regex = filterDto.s;
    return this.usersService.searchTerms(regex);
  }
}
