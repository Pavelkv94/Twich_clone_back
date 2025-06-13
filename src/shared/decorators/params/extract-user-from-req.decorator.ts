import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from 'src/modules/auth/account/models/user.model';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ExtractUserFromRequest = createParamDecorator((data: keyof UserModel, context: ExecutionContext) => {
  let user: UserModel;

  if (context.getType() === 'http') {
    user = context.switchToHttp().getRequest().user;
  } else {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    user = req.user;
  }

  return data ? user[data] : user;
});

