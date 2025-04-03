import { UsersService } from "@/modules/users/users.service";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Response } from "express";
import {
  AuthPayload,
  AuthRegisterInput,
  JWTAccessToken,
  LoginInput,
  UserPayload,
} from "./dto/auth.dto";

import { setHashPassword } from "@/helpers/utils";
import { RolesService } from "@/modules/roles/roles.service";
import { UserType } from "@/modules/users/dto/user.dto";
import { IUser } from "@/modules/users/entities/users";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(
    authRegisterInput: AuthRegisterInput,
    currentUser: IUser
  ): Promise<UserType> {
    return this.userService.register(authRegisterInput, currentUser);
  }

  async validateUser(loginInput: LoginInput): Promise<AuthPayload> | null {
    const user = await this.userService.findByEmail(loginInput.email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compareSync(
      loginInput.password,
      user.password
    );
    if (!isMatch) {
      return null;
    }

    const { isActive, codeExpired, codeId, ...result } = user;
    return result;
  }

  async createRefreshToken(payload: UserPayload, res: Response) {
    const expires_in = this.configService.get<string>("JWT_REFRESH_EXPIRED");
    const refresh_token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: expires_in,
    });

    //set refresh_token as cookies
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    //update user with refresh token
    await this.userService.updateUserToken(refresh_token, payload.id);

    return {
      refresh_token,
      expires_in,
    };
  }

  updateRefreshToken = async (userId: string, refreshToken: string) => {
    const hashedRefreshToken = await setHashPassword(refreshToken);
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  };

  async login(user: AuthPayload, res: Response): Promise<JWTAccessToken> {
    const expiresIn = new Date();
    expiresIn.setSeconds(
      expiresIn.getSeconds() +
        this.configService.getOrThrow("JWT_ACCESS_TOKEN_EXPIRED")
    );
    const payload = {
      sub: "token login",
      iss: "from server",
      id: user.id,
      email: user.email,
      // role: user.role,
      avatar: user.avatar,
      address: user.address,
    };

    const tokens = await this.getTokens(user.id, user.email);
    res.cookie("Authentication", tokens.access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
    res.cookie("RefreshToken", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1000, // 7 ngày
    });
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      ...tokens,
      user: {
        id: payload.id,
        email: payload.email,
        // role: payload.role,
        address: payload.address,
        avatar: payload.avatar,
        // permissions
      },
    };
  }

  logout = async (userId: string) => {
    this.userService.updateUser(userId, { refreshToken: null });
  };

  refreshTokens = async (userId: string, refreshToken: string) => {
    const user = await this.userService.findOne({ id: userId });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }

    const refreshTokenMatches = await bcrypt.compareSync(
      refreshToken,
      user.refreshToken
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException("Access Denied");
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  };

  getTokens = async (userId: string, username: string) => {
    const accessExpired = +this.configService.get<string>(
      "JWT_ACCESS_TOKEN_EXPIRED"
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
          expiresIn: accessExpired,
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
          expiresIn: this.configService.get<string>(
            "JWT_REFRESH_TOKEN_EXPIRED"
          ),
        }
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_expire: accessExpired,
    };
  };

  /* processNewToken = async (refreshToken: string, response: Response) => {
      try {
          this.jwtService.verify(refreshToken, {
              secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
          })
          let user = await this.userService.findUserByToken(refreshToken);
          if (user) {
              const { avatar, id, email } = user;
              const payload = {
                  sub: "token refresh",
                  iss: "from server",
                  avatar,
                  id,
                  email,
                  // role
              };

              const refreshToken = await this.createRefreshToken(payload, response);

              return {
                  access_token: this.jwtService.sign(payload),
                  refresh_token: refreshToken.refresh_token,
                  user: {
                      id,
                      name,
                      email,
                      // role,
                      // permissions: temp?.permissions ?? []
                  }
              };
          } else {
              throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
          }
      } catch (error) {
          throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
      }
  } */
}
