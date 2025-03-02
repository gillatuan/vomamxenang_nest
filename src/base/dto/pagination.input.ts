import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field()
  filter?: string; // JSON string for filtering

  @Field()
  sort?: string; // JSON string for sorting

  @Field()
  limit?: number; // Limit for pagination

  @Field()
  skip?: number; // Offset for pagination
}
