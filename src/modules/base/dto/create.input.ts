import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class CreateInput {
  @IsOptional()
  id?: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
}
