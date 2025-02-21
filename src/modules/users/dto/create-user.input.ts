import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  OmitType
} from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { RoleEnum, UserType } from './user.dto';

@InputType()
@ObjectType()
@ArgsType()
export class RegisterUserInput extends OmitType(UserType, ['avatar', 'role'] as const) {
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

  @Field()
  avatar?: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  role?: string;
}
