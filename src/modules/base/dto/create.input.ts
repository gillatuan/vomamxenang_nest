import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateInput {
  @Field()
  id?: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
}
