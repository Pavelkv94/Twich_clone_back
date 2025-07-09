import { Args, Context, Resolver, Mutation } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { VerificationInput } from './inputs/verification.input';
import { ExtractUserAgent } from '@/src/shared/decorators/params/extract-user-agent.decorator';
import { UserModel } from '../account/models/user.model';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { GqlThrottlerGuard } from '@/src/shared/guards/throttler.guard';
import { UseGuards } from '@nestjs/common';

@Resolver('Verification')
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) { }


  @Mutation(() => UserModel, { name: 'verifyAccount' })
  @UseGuards(GqlThrottlerGuard)
  async verify(@Context() context: GqlContext, @Args('input') input: VerificationInput, @ExtractUserAgent() userAgent: string) {
    const metadata = getSessionMetadata(context.req, userAgent);
    return this.verificationService.verifyAccount(input.token, context.req.session, metadata);
  }
}
