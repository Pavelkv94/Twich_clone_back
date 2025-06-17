import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { FollowModel } from './models/follow.model';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { User } from '@/prisma/generated';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver('Follow')
@UseGuards(GqlAuthGuard)
export class FollowResolver {
  constructor(private readonly followService: FollowService) { }

  @Query(() => [FollowModel], { name: 'findMyFollowers' })
  async findMyFollowers(@ExtractUserFromRequest() user: User) {
    return this.followService.findMyFollowers(user);
  }

  @Query(() => [FollowModel], { name: 'findMyFollowings' })
  async findMyFollowings(@ExtractUserFromRequest() user: User) {
    return this.followService.findMyFollowings(user);
  }

  @Mutation(() => Boolean, { name: 'follow' })
  async follow(@Args('channelId') channelId: string, @ExtractUserFromRequest() user: User) {
    return this.followService.follow(user, channelId);
  }

  @Mutation(() => Boolean, { name: 'unfollow' })
  async unfollow(@Args('channelId') channelId: string, @ExtractUserFromRequest() user: User) {
    return this.followService.unfollow(user, channelId);
  }
}
