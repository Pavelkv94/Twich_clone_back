import { LivekitService } from '@/src/core/modules/livekit/livekit.service';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { TransactionStatus, User } from '@/prisma/generated';
import { TelegramService } from '../telegram/telegram.service';
import Stripe from 'stripe';
import { StripeService } from '@/src/core/modules/stripe/stripe.service';
import { StripeConfig } from '@/src/core/modules/stripe/stripe.config';

@Injectable()
export class WebhookService {
    constructor(
        private readonly livekitService: LivekitService,
        private readonly prismaService: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly telegramService: TelegramService,
        private readonly stripeService: StripeService,
        private readonly stripeConfig: StripeConfig
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

    async receiveWebhookStripe(event: Stripe.Event) {
        const session = event.data.object as Stripe.Checkout.Session;

        if (event.type === 'checkout.session.completed') {
            const planId = session.metadata?.planId;
            const channelId = session.metadata?.channelId;
            const userId = session.metadata?.userId;

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); //* 30 days subscription


            const sponsorshipSubscription = await this.prismaService.sponsorshipSubscription.create({
                data: {
                    planId: planId as string,
                    channelId: channelId as string,
                    userId: userId as string,
                    expiresAt
                },
                include: {
                    plan: true,
                    user: true,
                    channel: {
                        include: {
                            notificationSettings: true
                        }
                    }
                }
            })

            await this.prismaService.transaction.updateMany({
                where: {
                    stripeSubscriptionId: session.id,
                    status: TransactionStatus.PENDING
                },
                data: {
                    status: TransactionStatus.SUCCESS
                }
            })

            if (sponsorshipSubscription.channel.notificationSettings?.siteNotification) {
                await this.notificationService.createNewSponsorship(sponsorshipSubscription.channelId, sponsorshipSubscription.plan, sponsorshipSubscription.user);
            }
            if (sponsorshipSubscription.channel.notificationSettings?.telegramNotification && sponsorshipSubscription.channel.telegramId) {
                await this.telegramService.sendNewSponsorship(sponsorshipSubscription.channel.telegramId, sponsorshipSubscription.plan, sponsorshipSubscription.user);
            }
        }

        if (event.type === 'checkout.session.expired') {
            await this.prismaService.transaction.updateMany({
                where: {
                    stripeSubscriptionId: session.id,
                },
                data: {
                    status: TransactionStatus.EXPIRED
                }
            })
        }

        if (event.type === 'checkout.session.async_payment_failed') {
            await this.prismaService.transaction.updateMany({
                where: {
                    stripeSubscriptionId: session.id,
                },
                data: {
                    status: TransactionStatus.FAILED
                }
            })
        }
    }


    async constructStripeEvent(paylaod: any, signature: string) {
        return this.stripeService.webhooks.constructEvent(paylaod, signature, this.stripeConfig.stripeWebhookSecret);

    }

}
