import { UserType } from '@/modules/users/dto/user.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseType {
  @Field({ nullable: true })
  id?: string;

  @Field()
  createdAt: Date;
  @Field(() => UserType, { nullable: true })
  createdBy?: UserType;

  @Field()
  updatedAt: Date;
  @Field(() => UserType, { nullable: true })
  updatedBy?: UserType;

  @Field({ defaultValue: null })
  deletedAt?: Date;

  @Field({ defaultValue: false })
  isDeleted?: boolean;

  @Field(() => UserType, { nullable: true })
  deletedBy?: UserType;
}
