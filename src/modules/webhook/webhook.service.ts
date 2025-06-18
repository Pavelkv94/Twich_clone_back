import { LivekitService } from '@/src/core/modules/livekit/livekit.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { User } from '@/prisma/generated';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class WebhookService {
    constructor(
        private readonly livekitService: LivekitService,
        private readonly prismaService: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly telegramService: TelegramService
    ) { }

    async receiveWebhookLivekit(body: any, authHeader: string) {
        const event = await this.livekitService.receiver.receive(body, authHeader, true); //* true - not safe

        if (!event) {
            throw new BadRequestException('Invalid webhook');
        }
        if (event.event === 'ingress_started') {

            console.log('STREAM STARTED');

            const stream = await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: true
                },
                include: {
                    user: true
                }
            })
            const followers = await this.prismaService.follow.findMany({
                where: {
                    followingId: stream.user?.id,
                    follower: {
                        isDeactivated: false
                    }
                },
                include: {
                    follower: {
                        include: {
                            notificationSettings: true
                        }
                    }
                }
            })

            for (const follower of followers) {
                const followerUser = follower.follower;
                if (followerUser.notificationSettings?.siteNotification) {
                    await this.notificationService.createNotificationStreamStarted(followerUser.id, stream.user as User);
                }
                if (followerUser.notificationSettings?.telegramNotification && followerUser.telegramId) {
                    await this.telegramService.sendStreamStart(followerUser.telegramId, stream.user as User);
                }
            }

        }

        if (event.event === 'ingress_ended') {
            console.log('Stream ended');
            const stream = await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: false
                }
            })

            await this.prismaService.chatMessage.deleteMany({
                where: {
                    streamId: stream.id
                }
            })

        }
    }
}
