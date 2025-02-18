import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import {
  AuthPayload,
  AuthRegisterInput,
  JWTAccessToken,
  LoginInput,
  UserPayload,
} from './dto/auth.dto';

import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(authRegisterInput: AuthRegisterInput): Promise<User> {
    return this.userService.register(authRegisterInput);
  }

  async validateUser(loginInput: LoginInput): Promise<AuthPayload> | null {
    const user = await this.userService.findByEmail(loginInput.email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(loginInput.password, user.password);
    if (!isMatch) {
      return null;
    }

    const { password, isActive, codeExpired, codeId, ...result } = user;
    return result;
  }

  async createAccessToken(payload: UserPayload) {
    return await this.jwtService.sign(payload);
  }

  async createRefreshToken(payload: UserPayload, res: Response) {
    const expires_in = this.configService.get<string>('JWT_REFRESH_EXPIRED')
    const refresh_token = await this.jwtService.sign(payload, {
      expiresIn: expires_in,
    });

    //set refresh_token as cookies
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(expires_in),
    });

    //update user with refresh token
    await this.userService.updateUserToken(refresh_token, payload.id);

    return {
      refresh_token,
      expires_in
    }
  }

  async login(user: AuthPayload, res: Response): Promise<JWTAccessToken> {
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id: user.id,
      email: user.email,
      // role: user.role,
      avatar: user.avatar,
      address: user.address
    };
    const dataRefreshToken = await this.createRefreshToken(payload, res);
    const accessToken = await this.createAccessToken(payload);

    return {
      access_token: accessToken,
      refresh_token: dataRefreshToken.refresh_token,
      access_expire: dataRefreshToken.expires_in,
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
}
