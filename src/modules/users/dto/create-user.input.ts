import { CreateRoleInput } from '@/modules/roles/dto/create-role.input';
import { UpdateRoleInput } from '@/modules/roles/dto/update-role.input';
import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType
} from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { RoleEnum, UserType } from './user.dto';

@InputType()
export class RegisterUserInput extends OmitType(PartialType(UserType), ['avatar', 'role']) {
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

  @Field({defaultValue: "", nullable: true})
  @IsOptional()
  avatar?: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field(() => UpdateRoleInput, {nullable: true})
  role: UpdateRoleInput;
}
