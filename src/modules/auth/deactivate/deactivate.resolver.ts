import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { DeactivateService } from './deactivate.service';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { User } from '@/prisma/generated';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { GqlThrottlerGuard } from '@/src/shared/guards/throttler.guard';

@Resolver('Deactivate')
  @UseGuards(GqlAuthGuard, GqlThrottlerGuard)
export class DeactivateResolver {
  constructor(private readonly deactivateService: DeactivateService) { }

  @Mutation(() => Boolean, { name: 'deactivateAccount' })
  async deactivateAccount(@Args('input') input: DeactivateAccountInput, @Context() context: any, @ExtractUserFromRequest() user: User) {
    const session = context.req.session;
    return this.deactivateService.deactivateAccount(input, user, session);
  }
}
