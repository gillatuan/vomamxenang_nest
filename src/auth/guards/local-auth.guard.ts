import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // Override this method so it can be used in graphql
/*   getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    
    const gqlReq = ctx.getContext().req;
    if (gqlReq) {
      const { loginInput } = ctx.getArgs();
      gqlReq.body = loginInput;
      return gqlReq;
    }

    return context.switchToHttp().getRequest();
  } */
}
