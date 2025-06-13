import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ExtractUserAgent = createParamDecorator((data: unknown, context: ExecutionContext) => {

    if (context.getType() === 'http') {
        const req = context.switchToHttp().getRequest();

        return req.headers['user-agent'];
    } else {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        return req.headers['user-agent'];
    }

});

