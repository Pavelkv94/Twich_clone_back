import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PassRecoveryService } from './pass-recovery.service';
import { ResetPassInput } from './inputs/reset-pass.input';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { ExtractUserAgent } from '@/src/shared/decorators/params/extract-user-agent.decorator';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { UseGuards } from '@nestjs/common';
import { GqlThrottlerGuard } from '@/src/shared/guards/throttler.guard';

@Resolver('PassRecovery')
  @UseGuards(GqlThrottlerGuard)
export class PassRecoveryResolver {
  constructor(private readonly passRecoveryService: PassRecoveryService) { }


  @Mutation(() => Boolean, { name: 'resetPassword' })
  async resetPassword(@Context() context: GqlContext, @Args('input') input: ResetPassInput, @ExtractUserAgent() userAgent: string) {
    const metadata = getSessionMetadata(context.req, userAgent);
    return this.passRecoveryService.resetPassword(input, metadata);
  }

  @Mutation(() => Boolean, { name: 'setNewPassword' })
  async setNewPassword(@Args('input') input: NewPasswordInput) {
    return this.passRecoveryService.setNewPassword(input);
  }
}
