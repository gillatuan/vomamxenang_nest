import { ArgsType, Field, InputType } from "@nestjs/graphql";

@InputType()
@ArgsType()
export class FilterDto {
  @Field()
  s?: string;
}
