import { CreateInput } from "@/modules/base/dto/create.input";
import { CreatePermissionInput } from "@/modules/permissions/dto/create-permission.input";
import { PermissionType } from "@/modules/permissions/dto/permission.dto";
import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsNotEmpty } from "class-validator";

@InputType()
export class CreateRoleInput extends CreateInput {
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

 /*  @Field(() => [CreatePermissionInput], { defaultValue: [] }) // ✅ Explicitly define the GraphQL type
  permissions: CreatePermissionInput[]; */
}
