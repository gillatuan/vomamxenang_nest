import { UsersService } from "@/modules/users/users.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
      passReqToCallback: true, // Allows passing request object
    });
  }

  async validate(payload) {
    return payload;
    /* const { _id, name, email, role } = payload;
        const user = await this.usersService.findOne(payload.sub);
        // cần gán thêm permissions vào req.user
        const userRole = role as unknown as { _id: string; name: string }
        // const temp = (await this.rolesService.findOne(userRole._id)).toObject();

        //req.user
        return {
            _id,
            name,
            email,
            role,
            // permissions: temp?.permissions ?? []
        }; */
  }
}
