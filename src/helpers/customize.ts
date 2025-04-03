import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); //key:value

export const RESPONSE_MESSAGE = "response_message";
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

export const IS_PUBLIC_PERMISSION = "isPublicPermission";
export const SkipCheckPermission = () =>
  SetMetadata(IS_PUBLIC_PERMISSION, true);

export const GqlCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req.user; // Extract user from GraphQL context
  }
);

export const GqlCookie = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req.cookies; // Extract user from GraphQL context
  }
);

export const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType() === "http") {
    return context.switchToHttp().getRequest().user;
  } else if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req.user
  }
};
