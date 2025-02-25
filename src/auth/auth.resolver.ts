// auth.resolver.ts
import { AuthService } from "@/auth/auth.service";
import {
  AuthPayload,
  AuthRegisterInput,
  JWTAccessToken,
  LoginInput,
} from "@/auth/dto/auth.dto";
import { LocalAuthGuard } from "@/auth/guards/local-auth.guard";
import { GqlCurrentUser, Public } from "@/helpers/customize";
import { UserType } from "@/modules/users/dto/user.dto";
import { IUser } from "@/modules/users/entities/users";
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

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
  @UseGuards(LocalAuthGuard)
  login(
    @Args("loginInput") loginInput: LoginInput,
    @Context("res") res
  ): Promise<JWTAccessToken> {
    const userPayload = res.req.user as AuthPayload;
    return this.authService.login(userPayload, res);
  }
}
