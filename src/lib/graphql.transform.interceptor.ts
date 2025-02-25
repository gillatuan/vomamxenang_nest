import { RESPONSE_MESSAGE } from '@/helpers/customize';
import { GraphQLResponse } from '@/modules/base/dto/graphql-response.dto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GraphQLTransformInterceptor<T> implements NestInterceptor {
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
      map((data) => {
        return {
          statusCode,
          message:
            this.reflector.get<string>(
              RESPONSE_MESSAGE,
              context.getHandler(),
            ) || '',
          data: data !== undefined && data !== null ? data : null,  // ✅ Ensure data is not undefined
        };
      }),
    );
  }
}
