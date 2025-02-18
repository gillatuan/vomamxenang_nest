import { PaginationResponse } from '@/modules/base/dto/pagination.response';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
@ArgsType()
export class PermissionType {
  @Field()
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'apiPath không được để trống' })
  apiPath: string;

  @Field()
  @IsNotEmpty({ message: 'method không được để trống' })
  method: string;

  @Field()
  @IsNotEmpty({ message: 'module không được để trống' })
  module: string;
}

@ObjectType()
export class PermissionPaginationResponse extends PaginationResponse {
  @Field(() => [PermissionType])
  data: PermissionType[]; // The list of items in the current page
}

