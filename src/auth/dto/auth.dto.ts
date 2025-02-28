import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class AuthRegisterInput {
  @Field()
  @IsNotEmpty({ message: "Email ko de trong" })
  @IsEmail({}, { message: "Email ko dung dinh dang" })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password ko de trong" })
  password: string;

  @Field()
  @IsNotEmpty({ message: "Phone ko de trong" })
  phone: string;

  @Field()
  @IsNotEmpty({ message: "Address ko de trong" })
  address: string;
}

@InputType()
@ArgsType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  id?: string;

  @Field()
  email: string;

  @Field()
  providerId?: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field()
  @IsOptional()
  avatar?: string;

  /*   @Field()
  @IsOptional()
  role?: Roles; */
}

@ObjectType()
export class UserPayload {
  @Field()
  id: string;

  @Field()
  email: string;

  /*   @Field()
  @IsOptional()
  role?: Roles; */

  @Field()
  @IsOptional()
  address?: string;

  @Field()
  avatar: string;
}

@ObjectType()
export class JWTRefreshAccessToken {
  @Field()
  access_token: string;

  @Field()
  user: UserPayload;
}

@ObjectType()
export class JWTAccessToken extends JWTRefreshAccessToken {
  @Field()
  refresh_token: string;

  @Field()
  access_expire: string;
}
