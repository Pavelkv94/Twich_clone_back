import { Resolver, Query, Args } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { User } from '@/prisma/generated';
import { UserModel } from '../auth/account/models/user.model';

@Resolver('Channel')
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) { }

  @Query(() => [UserModel], { name: 'findRecommendedChannels' })
  async findRecommendedChannels(@ExtractUserFromRequest() user: User) {
    return this.channelService.findRecommendedChannels(user);
  }

  @Query(() => UserModel, { name: 'findChannelByUsername' })
  async findChannelByUsername(@Args('username') username: string) {
    return this.channelService.findChannelByUsername(username);
  }

  @Query(() => Number, { name: 'findFollowersCountByChannel' })
  async findFollowersCountByChannel(@Args('channelId') channelId: string) {
    return this.channelService.findFollowersCountByChannel(channelId);
  }
}
