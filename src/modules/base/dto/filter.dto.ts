import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class FilterDto {
  @Field(() => String)
  s: string;
}
