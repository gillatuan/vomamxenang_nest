import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GraphQLResponse {
  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  error?: string;
}