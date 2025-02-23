import { CreateInput } from "@/modules/base/dto/create.input";
import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
@ArgsType()
export class CreatePermissionInput extends CreateInput {
  @Field()
  @IsNotEmpty({ message: "name không được để trống" })
  name: string;

  @Field()
  @IsNotEmpty({ message: "method không được để trống" })
  method: string;

  @Field()
  @IsNotEmpty({ message: "module không được để trống" })
  module: string;
}
