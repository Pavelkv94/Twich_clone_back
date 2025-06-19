import { User } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/modules/prisma/prisma.service';
import { StripeService } from '@/src/core/modules/stripe/stripe.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanInput } from './inputs/create-plan.input';

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService, private readonly stripeService: StripeService) { }

  async findMyPlans(user: User) {
    const plans = this.prismaService.sponsorshipPlan.findMany({
      where: {
        channelId: user.id,
      },
    });
    return plans;
  }

  async createPlan(user: User, input: CreatePlanInput) {
    const { title, description, price } = input;
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      }
    });

    if (!channel?.isVerified) {
      throw new BadRequestException('Channel is not verified. Only verified channels can create plans.');
    }

    const stripePlan = await this.stripeService.plans.create({
      amount: Math.round(price * 100),
      currency: 'pln',
      interval: 'month',
      product: {
        name: title
      }
    });

    await this.prismaService.sponsorshipPlan.create({
      data: {
        title,
        description,
        price,
        stripeProductId: stripePlan.product?.toString() ?? '',
        stripePlanId: stripePlan.id,
        channel: {
          connect: {
            id: user.id,
          }
        }
      }
    });

    return true
  }

  async removePlan(user: User, planId: string) {
    const plan = await this.prismaService.sponsorshipPlan.findUnique({
      where: {
        id: planId,
      }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    //* must be this order
    await this.stripeService.plans.del(plan.stripePlanId);
    await this.stripeService.products.del(plan.stripeProductId);

    await this.prismaService.sponsorshipPlan.delete({
      where: { id: planId }
    });

    return true;
  }

}
