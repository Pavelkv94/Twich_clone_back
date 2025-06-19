import { User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { StripeService } from '@/src/core/modules/stripe/stripe.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TransactionService {
    constructor(private readonly prismaService: PrismaService, private readonly stripeService: StripeService) { }

    async myTransactions(user: User) {
        const transactions = await this.prismaService.sponsorshipSubscription.findMany({
            where: {
                userId: user.id,
            },
        });
        return transactions;
    }

    async makePayment(user: User, planId: string) {
        const plan = await this.prismaService.sponsorshipPlan.findUnique({
            where: {
                id: planId,
            },
            include: {
                channel: true,
            }
        });

        if (!plan) {
            throw new NotFoundException('Plan not found');
        }
        if (user.id === plan.channelId) {
            throw new BadRequestException('You cannot subscribe to your own plan');
        }

        const existingSubscription = await this.prismaService.sponsorshipSubscription.findFirst({
            where: {
                userId: user.id,
                channelId: plan.channel.id,
            },
        });

        if (existingSubscription) {
            throw new BadRequestException('You already have an active subscription to this plan');
        }

        const customer = await this.stripeService.customers.create({
            name: user.displayName,
            email: user.email,
        });

        const payment = await this.stripeService.checkout.sessions.create({
            payment_method_types: ['card', 'blik', 'paypal'],
            line_items: [{
                price_data: {
                    currency: 'pln',
                    product_data: {
                        name: plan.title,
                        description: plan.description ?? 'None',
                    },
                    unit_amount: Math.round(plan.price * 100),
                    // recurring: {
                    //     interval: 'month',
                    // },
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `https://frontend-app.com/sponsorship/success?price=${plan.price}&username=${plan.channel.username}`, // TODO: change to actual url from config
            cancel_url: `https://frontend-app.com/sponsorship/cancel?price=${plan.price}&username=${plan.channel.username}`, // TODO: change to actual url from config
            customer: customer.id,
            metadata: {
                planId: plan.id,
                userId: user.id,
                channelId: plan.channel.id,
            },
        });


        await this.prismaService.transaction.create({
            data: {
                amount: plan.price,
                currency: payment.currency ?? 'pln',
                stripeSubscriptionId: payment.id,
                user: {
                    connect: {
                        id: user.id,
                    }
                },


            },
        });

        return { url: payment.url };
    }
}
