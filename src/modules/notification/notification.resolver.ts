import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { ChangeNotificationSettingsResponse, NotificationSettingsModel } from './models/notification-settings.model';
import { NotificationSettingsInput } from './inputs/notification-settings.input';
import { NotificationModel } from './models/notification.model';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { User } from '@/prisma/generated';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver('Notification')
@UseGuards(GqlAuthGuard)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) { }

  @Query(() => Int, { name: 'findUnreadNotificationsCount' })
  async findUnreadNotificationsCount(@ExtractUserFromRequest() user: User) {
    return this.notificationService.findUnreadNotificationsCount(user);
  }

  @Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
  async findNotificationsByUser(@ExtractUserFromRequest() user: User) {
    return this.notificationService.findNotificationsByUser(user);
  }

  @Mutation(() => ChangeNotificationSettingsResponse, { name: 'changeNotificationSettings' })
  async changeNotificationSettings(@ExtractUserFromRequest() user: User, @Args('input') input: NotificationSettingsInput) {
    return this.notificationService.updateNotificationSettings(user, input);
  }

}
