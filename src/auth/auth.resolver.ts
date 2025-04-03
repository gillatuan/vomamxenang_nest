// auth.resolver.ts
import { AuthService } from "@/auth/auth.service";
import {
  AuthPayload,
  AuthRegisterInput,
  JWTAccessToken,
  LoginInput,
} from "@/auth/dto/auth.dto";
import { GqlCurrentUser, Public, ResponseMessage } from "@/helpers/customize";
import { UserResponse, UserType } from "@/modules/users/dto/user.dto";
import { IUser } from "@/modules/users/entities/users";
import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { Response } from "express";
import { GqlAuthGuard } from "./guards/gql-auth.guard";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserType)
  @Public()
  authRegister(
    @Args("authRegisterInput") authRegisterInput: AuthRegisterInput,
    @GqlCurrentUser() currentUser: IUser
  ): Promise<UserType> {
    return this.authService.register(authRegisterInput, currentUser);
  }

  @Mutation(() => JWTAccessToken)
  @Public()
  @UseGuards(GqlAuthGuard)
  login(
    @Args("loginInput") loginInput: LoginInput,
    @Context() context
  ): Promise<JWTAccessToken> {
    const res: Response = context.res; // ✅ This works!
    const userPayload = context.req.user as AuthPayload;
    return this.authService.login(userPayload, res);
  }

  @Public()
  @ResponseMessage("Logout")
  @Mutation(() => JWTAccessToken, { name: "Logout" })
  @UseGuards(GqlAuthGuard)
  logout(@Context() context) {
    const userPayload = context.req.user as AuthPayload;

    return this.authService.logout(userPayload.id);
  }

  @ResponseMessage("Get user information")
  @Query(() => UserResponse, { nullable: true })
  account(@GqlCurrentUser() currentUser: IUser) {
    /* const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp.permissions;
    return { user }; */
  }

  @Public()
  @ResponseMessage("Get User by refresh token")
  @Query(() => JWTAccessToken, { name: "refresh", nullable: true })
  getRefreshToken(@Context() context) {
    const res = GqlExecutionContext.create(context).getContext().res;
    const refreshToken = context.req.cookie["refresh_token"];
    return this.authService.getTokens(refreshToken, res);
  }
}
