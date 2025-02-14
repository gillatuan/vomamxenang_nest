import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true }) // Prevents direct schema generation
export abstract class PaginationResponse {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}
