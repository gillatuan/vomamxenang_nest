import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from "@/helpers/customize";
import { UsersService } from "@/modules/users/users.service";
import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    if (!ctx.getContext().req.headers.authorization) {
      throw new UnauthorizedException();
    }

    const token = this.extractToken(ctx.getContext().req);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("JWT_ACCESS_TOKEN_KEY"),
      });
      const user = await this.userService.findOne({ id: payload.id });
      ctx.getContext().req.user = user;

      return true;
    } catch (error) {
      console.log("err=> ", error);
      throw new BadRequestException("Invalid token!");
    }
  }

  private extractToken(req: any): string | undefined {
    const [type, token] = req.headers.authorization
      ? req.headers.authorization.split(" ")
      : [];

    return type === "Bearer" ? token : undefined;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSION,
      [context.getHandler(), context.getClass()]
    );

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          "Token không hợp lệ or không có token ở Bearer Token ở Header request!"
        )
      );
    }

    //check permissions
    const targetMethod = request.method;
    const targetEndpoint = request.url;

    const permissions = user?.permissions ?? [];
    let isExist = permissions.find(
      (permission) => targetMethod === permission.method
    );
    if (targetEndpoint.startsWith("/api/v1/auth")) isExist = true;
    if (!isExist && !isSkipPermission) {
      throw new ForbiddenException(
        "Bạn không có quyền để truy cập endpoint này!"
      );
    }

    return user;
  }
}
