import { Resolver, Query } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { SubscriptionModel } from './models/subscription.model';
import { UserModel } from '../../auth/account/models/user.model';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver('Subscription')
@UseGuards(GqlAuthGuard)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @Query(() => [SubscriptionModel], { name: 'findMySponsors' })
  async findMySponsors(@ExtractUserFromRequest() user: UserModel) {
    return this.subscriptionService.findMySponsors(user);
  }
}
