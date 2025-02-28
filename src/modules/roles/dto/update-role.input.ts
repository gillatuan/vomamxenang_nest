import { User } from '@/modules/users/entities/user.entity';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { OneToMany } from 'typeorm';
import { CreateRoleInput } from './create-role.input';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
}
