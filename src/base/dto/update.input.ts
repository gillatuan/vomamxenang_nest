import { Field, InputType, OmitType } from "@nestjs/graphql";
import { CreateInput } from "./create.input";

@InputType()
export class UpdateInput {
  @Field()
  id: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
}
