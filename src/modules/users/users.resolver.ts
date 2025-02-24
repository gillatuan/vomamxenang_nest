import { CurrentUser, GqlCurrentUser } from "@/decorator/customize";
import { Public } from "@/helpers/setPubicPage";
import { UserPaginationResponse, UserType } from "@/modules/users/dto/user.dto";
import { User } from "@/modules/users/entities/user.entity";
import { UsersService } from "@/modules/users/users.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FilterDto } from "../base/dto/filter.dto";
import { RegisterUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => String)
  @Public()
  async helloo() {
    return await "world";
  }

  @Query(() => UserType, { nullable: true })
  me(@GqlCurrentUser() user: User) {
    return user; // Returns the authenticated user
  }

  @Query(() => UserType)
  findOne(@Args("id") id: string, @GqlCurrentUser() user): Promise<User | string> {
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

  @Query(() => UserType)
  async findByEmail(@Args("email") email: string): Promise<UserType | null> {
    return await this.usersService.findByEmail(email);
  }

  @Mutation(() => UserType)
  async registerUser(
    @Args("registerUserInput") registerUserInput: RegisterUserInput
  ): Promise<User> {
    return await this.usersService.register(registerUserInput);
  }

  @Mutation(() => String)
  async removeUser(@Args("id") id: string): Promise<String> {
    return await this.usersService.remove(id);
  }

  @Mutation(() => UserType, {name: "updateUser"})
  async updateUser(
    @Args("id") id: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput
  ): Promise<string> {
    return await this.usersService.updateUser(id, updateUserInput);
  }
}
