import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty } from "class-validator";

@InputType()
export class CreateRoleInput {
  @IsNotEmpty({ message: "name không được để trống" })
  @Field()
  name: string;

  @IsNotEmpty({ message: "description không được để trống" })
  @Field()
  description: string;

  @IsNotEmpty({ message: "isActive không được để trống" })
  @IsBoolean({ message: "isActive có giá trị boolean" })
  @Field()
  isActive: boolean;
}
