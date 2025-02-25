import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GraphQLResponse {
  @Field(() => Number)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  error?: string;
}