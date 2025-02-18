import { CreateItemInput } from '@/modules/permissions/dto/create-permission.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
}
