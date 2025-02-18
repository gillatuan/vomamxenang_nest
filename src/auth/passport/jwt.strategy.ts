import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
            passReqToCallback: true, // Allows passing request object
        });
    }

    async validate(payload) {
        const { _id, name, email, role } = payload;
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
        };
    }

}