import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class FollowService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly telegramService: TelegramService
    ) { }

    async findMyFollowers(user: User) {
        const followers = await this.prisma.follow.findMany({
            where: {
                followingId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                follower: true,
            },
        });

        return followers
    }

    async findMyFollowings(user: User) {
        const followings = await this.prisma.follow.findMany({
            where: {
                followerId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                following: true,
            },
        });

        return followings;
    }

    async follow(user: User, channelId: string) {
        const channel = await this.prisma.user.findUnique({
            where: {
                id: channelId,
            },
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }
        if (channel.id === user.id) {
            throw new BadRequestException('You cannot follow yourself');
        }

        const existingFollow = await this.prisma.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id,
            },
        });

        if (existingFollow) {
            throw new BadRequestException('You already follow this channel');
        }

        const follow = await this.prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: channel.id,
            },
            include: {
                follower: true,
                following: {
                    include: {
                        notificationSettings: true,
                    }
                },
            }
        });

        if (follow.following.notificationSettings?.siteNotification) {
            await this.notificationService.createNotificationNewFollower(follow.following.id, follow.follower);
        }
        if (follow.following.notificationSettings?.telegramNotification && follow.follower.telegramId) {
            await this.telegramService.sendNewFollower(follow.follower.telegramId, follow.follower);
        }

        return true;
    }

    async unfollow(user: User, channelId: string) {
        const channel = await this.prisma.user.findUnique({
            where: {
                id: channelId,
            },
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        const existingFollow = await this.prisma.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id,
            },
        });

        if (!existingFollow) {
            throw new BadRequestException('You not follow this channel');
        }

        await this.prisma.follow.delete({
            where: {
                id: existingFollow.id,
                followerId: user.id,
                followingId: channel.id,
            },
        });

        return true;
    }
}
