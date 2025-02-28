import { CreateInput } from '@/base/dto/create.input';
import { User } from '@/modules/users/entities/user.entity';
import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { OneToMany } from 'typeorm';

@InputType()
export class CreateRoleInput extends CreateInput {
  @Field()
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;

  @Field()
  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'isActive có giá trị boolean' })
  isActive: boolean;

/*   @OneToMany(() => User, (user) => user.role, { cascade: true })
  @Field(() => [User], { nullable: true })
  users?: User[]; */

  /*  @Field(() => [CreatePermissionInput], { defaultValue: [] }) // ✅ Explicitly define the GraphQL type
  permissions: CreatePermissionInput[]; */
}
