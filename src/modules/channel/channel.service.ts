import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChannelService {
    constructor(private readonly prismaService: PrismaService) { }

    async findRecommendedChannels(user: User) {
        const channels = await this.prismaService.user.findMany({
            where: {
                isDeactivated: false,
            },
            orderBy: {
                followings: {
                    _count: 'desc',
                }
            },
            include: {
                stream: true,
            },
            take: 7,
        });

        return channels;
    }

    async findChannelByUsername(username: string) {
        const channel = await this.prismaService.user.findUnique({
            where: {
                username,
            },
            include: {
                socialLinks: {
                    orderBy: {
                        position: 'asc',
                    },
                },
                stream: {
                    include: {
                        category: true,
                    },
                },
                followings: true,
            },
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        return channel;
    }

    async findFollowersCountByChannel(channelId: string) {
        const followersCount = await this.prismaService.follow.count({
            where: {
                following: {
                    id: channelId,
                },
            },
        });

        return followersCount;
    }
}
