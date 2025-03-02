import { RESPONSE_MESSAGE } from '@/helpers/customize';
import { GraphQLResponse } from '@/base/dto/graphql-response.dto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GraphQLTransformInterceptor<T> implements NestInterceptor<T, GraphQLResponse> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: GqlExecutionContext,
    next: CallHandler<T>,
  ): Observable<GraphQLResponse> {
    const gqlContext = GqlExecutionContext.create(context); // Extract GraphQL Context
    const ctx = gqlContext.getContext();
    
    // Get HTTP Response if available (works when GraphQL runs in HTTP mode)
    const httpResponse = ctx?.res;
    const statusCode = httpResponse?.statusCode || 200; // Default to 200 if not set

    return next.handle().pipe(
      map((data: T) => {
        return {
          statusCode,
          message:
            this.reflector.get<string>(
              RESPONSE_MESSAGE,
              context.getHandler(),
            ) || '',
          data: data ?? null,  // ✅ Ensure data is not undefined
        };
      }),
    );
  }
}
