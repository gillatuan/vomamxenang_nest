import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { AuthPayload } from "../dto/auth.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string): Promise<AuthPayload> {
    const loginInput = {
      email,
      password,
    };
    const user = await this.authService.validateUser(loginInput);
    if (!user) {
      throw new UnauthorizedException("Username/password không hợp lệ!");
    }

    return user; //req.user
  }
}
