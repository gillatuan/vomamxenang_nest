import { GqlCurrentUser, Public, ResponseMessage } from "@/helpers/customize";
import { GraphQLTransformInterceptor } from "@/lib/graphql.transform.interceptor";
import {
  UserPaginationResponse,
  UserPaginationResponseInterceptor,
  UserResponse,
  UserType,
} from "@/modules/users/dto/user.dto";
import { User } from "@/modules/users/entities/user.entity";
import { UsersService } from "@/modules/users/users.service";
import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FilterDto } from "../base/dto/filter.dto";
import { RegisterUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@UseInterceptors(GraphQLTransformInterceptor<UserType>)
@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserResponse)
  @Public()
  helloo() {
    return {
      email: "User Hello World",
    };
  }

  @Query(() => UserResponse, { nullable: true })
  me(@GqlCurrentUser() user: User) {
    return user; // Returns the authenticated user
  }

  @Mutation(() => UserResponse, { name: "registerUser" })
  @ResponseMessage("Register User")
  async registerUser(
    @Args("registerUserInput") registerUserInput: RegisterUserInput
  ): Promise<RegisterUserInput> {
    return await this.usersService.register(registerUserInput);
  }

  @Mutation(() => UserResponse, { name: "updateUser" })
  async updateUser(
    @Args("id") id: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput
  ): Promise<UpdateUserInput> {
    return await this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => UserResponse, { name: "removeUser" })
  async removeUser(
    @Args("id") id: string,
    @GqlCurrentUser() currentUser
  ): Promise<UpdateUserInput> {
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
