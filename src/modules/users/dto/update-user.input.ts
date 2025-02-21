import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Column, ObjectId } from 'typeorm';
import { RegisterUserInput } from './create-user.input';
import { RoleEnum } from './user.dto';

@InputType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {
  @Field()
  password?: string;

  @Field()
  isDeleted: boolean;

  @Field()
  role?: RoleEnum;

  @Column()
  deletedBy: {
    _id: ObjectId;
    email: string;
  };
}
