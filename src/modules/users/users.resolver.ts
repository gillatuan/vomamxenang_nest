import { GqlCurrentUser, Public, ResponseMessage } from "@/helpers/customize";
import { GraphQLTransformInterceptor } from "@/lib/graphql.transform.interceptor";
import {
  UserPaginationResponse,
  UserResponse,
  UserType,
} from "@/modules/users/dto/user.dto";
import { User } from "@/modules/users/entities/user.entity";
import { UsersService } from "@/modules/users/users.service";
import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FilterDto } from "../base/dto/filter.dto";
import { GraphQLResponse } from "../base/dto/graphql-response.dto";
import { RegisterUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => String)
  @Public()
  helloo() {
    return "User Hello World"
  }

  @Query(() => UserType, { nullable: true })
  me(@GqlCurrentUser() user: User) {
    return user; // Returns the authenticated user
  }

  @Query(() => UserType)
  findOne(
    @Args("id") id: string,
    @GqlCurrentUser() currentUser
  ): Promise<User | string> {
    return this.usersService.findOne({ id });
  }

  @Query(() => UserPaginationResponse, { name: "listUsers" })
  findAll(
    @Args("qs", { nullable: true }) qs?: string
  ): Promise<UserPaginationResponse> {
    return this.usersService.findAll(qs);
  }

  @Query(() => UserPaginationResponse, { name: "searchTermsOfUser" })
  searchTerms(
    @Args("filterDto") filterDto: FilterDto
  ): Promise<UserPaginationResponse> {
    // const regex = `email=/${filterDto.s}/&skip=0&limit=10&sort=-1`
    const regex = filterDto.s;
    return this.usersService.searchTerms(regex);
  }

  @ResponseMessage("Fetch permissions with paginate")
  @UseInterceptors(GraphQLTransformInterceptor<UserType>)
  @Query(() => UserResponse)
  findByEmail(@Args("email") email: string) {
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => UserType)
  async registerUser(
    @Args("registerUserInput") registerUserInput: RegisterUserInput
  ): Promise<User> {
    return await this.usersService.register(registerUserInput);
  }

  @Mutation(() => UserType)
  async removeUser(
    @Args("id") id: string,
    @GqlCurrentUser() currentUser
  ): Promise<UpdateUserInput> {
    return await this.usersService.remove(id, currentUser);
  }

  @Mutation(() => UserType, { name: "updateUser" })
  async updateUser(
    @Args("id") id: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput
  ): Promise<UpdateUserInput> {
    return await this.usersService.updateUser(id, updateUserInput);
  }
}
