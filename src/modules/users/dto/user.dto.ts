// user.dto.ts
import { PaginationResponse } from '@/modules/base/dto/pagination.response';
import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export enum RoleEnum {
  Admin = 'Admin',
  Member = 'Member',
}

@ObjectType()
export class UserType {
  @Field()
  @IsUUID()
  id: string;

  @Field()
  @IsNotEmpty({ message: 'Email ko de trong' })
  @IsEmail({}, { message: 'Email ko dung dinh dang' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone ko de trong' })
  phone: string;

  @Field()
  @IsNotEmpty({ message: 'Address ko de trong' })
  address: string;

  @Field(type => String, {nullable: true})
  avatar: string;

  @Field(type => String, { nullable: true })
  role: RoleEnum;

  @Field(type => Boolean, { defaultValue: false })
  isActive?: boolean;

  @Field(type => Boolean, { defaultValue: false })
  isDeleted: boolean;
}

@ObjectType()
export class UserPaginationResponse extends PaginationResponse {
  @Field(() => [UserType])
  data: UserType[]; // The list of items in the current page
}
