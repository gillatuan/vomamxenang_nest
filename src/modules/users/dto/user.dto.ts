// user.dto.ts
import { CreateInput } from "@/modules/base/dto/create.input";
import { PaginationResponse } from "@/modules/base/dto/pagination.response";
import { Field, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export enum RoleEnum {
  Admin = "Admin",
  Member = "Member",
}

@ObjectType()
export class UserType extends CreateInput {
  @Field()
  @IsNotEmpty({ message: "Email ko de trong" })
  @IsEmail({}, { message: "Email ko dung dinh dang" })
  email: string;

  @Field()
  password?: string;

  @Field()
  @IsNotEmpty({ message: "Phone ko de trong" })
  phone: string;

  @Field()
  @IsNotEmpty({ message: "Address ko de trong" })
  address: string;

  @Field(() => String, { nullable: true })
  avatar: string;

  @Field(() => String, { nullable: true })
  role: RoleEnum;

  @Field(() => Boolean, { defaultValue: false })
  isActive?: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isDeleted: boolean;

  @Field()
  codeId: string;

  @Field()
  codeExpired: Date;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class UserPaginationResponse extends PaginationResponse {
  @Field(() => [UserType])
  data: UserType[]; // The list of items in the current page
}
