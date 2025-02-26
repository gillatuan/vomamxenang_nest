import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BaseType {
  @Field({ nullable: true })
  id?: string;
}
