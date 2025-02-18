import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
@ArgsType()
export class FilterDto {
  @Field()
  @IsOptional()
  s: string;
}
