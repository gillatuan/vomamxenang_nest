import { AppModule } from "@/app.module";
import { UsersService } from "@/modules/users/users.service";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import cookieParser from "cookie-parser";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);
  const usersService = app.get(UsersService);

  /*   app.useGlobalInterceptors({
    intercept: (context: GqlExecutionContext, next) => {
      // Check if the request belongs to AuthModule
      const gqlContext = context.getClass?.();
      if (gqlContext?.name === "AuthResolver") {
        return next.handle(); // ✅ Skip the interceptor for AuthModule
      }

      // ✅ Apply GraphQLTransformInterceptor globally
      return new GraphQLTransformInterceptor(reflector).intercept(
        context,
        next
      );
    },
  }); */

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector, jwtService, usersService, configService)
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.use(cookieParser());

  //config cors
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  });

  // set prefix
  // app.setGlobalPrefix('api/v1', { exclude: [''] });

  await app.listen(configService.get<string>("PORT"));
}
bootstrap();
