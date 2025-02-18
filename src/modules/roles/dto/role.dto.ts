import { Field, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "typeorm";

@ObjectType()
export class RoleType {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  isActive: boolean;

/*   @Field(() => ObjectId)
  permissions: ObjectId[]; */
}
