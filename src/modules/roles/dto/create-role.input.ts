import { RegisterUserInput } from "@/modules/users/dto/create-user.input";
import { User } from "@/modules/users/entities/user.entity";
import { Field, InputType, OmitType, PartialType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { OneToMany } from "typeorm";
import { RoleType } from "./role.dto";

@InputType()
export class CreateRoleInput extends OmitType(PartialType(RoleType), [
  "users",
]) {
  @Field()
  @IsNotEmpty({ message: "name không được để trống" })
  name: string;

  @Field()
  @IsNotEmpty({ message: "description không được để trống" })
  description: string;

  @Field()
  @IsNotEmpty({ message: "isActive không được để trống" })
  @IsBoolean({ message: "isActive có giá trị boolean" })
  isActive: boolean;

  @Field(() => [RegisterUserInput], { nullable: true })
  users?: RegisterUserInput[];

  /*  @Field(() => [CreatePermissionInput], { defaultValue: [] }) // ✅ Explicitly define the GraphQL type
  permissions: CreatePermissionInput[]; */
}
