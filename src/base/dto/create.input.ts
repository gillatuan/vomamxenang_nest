import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class CreateInput {
  @Field({ nullable: true})
  id?: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
}
