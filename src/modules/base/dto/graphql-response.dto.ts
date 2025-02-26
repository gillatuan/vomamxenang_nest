import { ArgsType, Field, Int, ObjectType, ReturnTypeFunc } from "@nestjs/graphql";

export function GenericField<T>(typeFn: ReturnTypeFunc) {
  return Field(typeFn);
}
@ObjectType()
@ArgsType()
export class GraphQLResponse {

  // ❌ You cannot use @Field(() => T) directly
  // ✅ Instead, define a function that takes a class type
  static forType<T>(classRef: new () => T) {
    @ObjectType({ isAbstract: true })
    abstract class ResponseType {
      @Field(() => Int)
      statusCode: number;
    
      @Field(() => String)
      message: string;
    
      @Field(() => String, { nullable: true })
      error?: string;

      @Field(() => classRef, { nullable: true }) // ✅ Use function argument instead of generic
      data?: T;
    }
    return ResponseType;
  }
}
