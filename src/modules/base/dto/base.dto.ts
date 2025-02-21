import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@ObjectType()
@ArgsType()
export class BaseType {
  @IsOptional()
  @Field()
  id: string;
}
