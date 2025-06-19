import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlanService } from './plan.service';
import { ExtractUserFromRequest } from '@/src/shared/decorators/params/extract-user-from-req.decorator';
import { PlanModel } from './models/plan.model';
import { UseGuards } from '@nestjs/common';
import { User } from '@/prisma/generated/client';
import { GqlAuthGuard } from '@/src/shared/guards/gql-auth.guard';
import { CreatePlanInput } from './inputs/create-plan.input';

@Resolver('Plan')
@UseGuards(GqlAuthGuard)
export class PlanResolver {
  constructor(private readonly planService: PlanService) { }

  @Query(() => [PlanModel], { name: 'findMyPlans' })
  async findMyPlans(@ExtractUserFromRequest() user: User) {
    return this.planService.findMyPlans(user);
  }

  @Mutation(() => Boolean, { name: 'createPlan' })
  async createPlan(@ExtractUserFromRequest() user: User, @Args('input') input: CreatePlanInput) {
    return this.planService.createPlan(user, input);
  }

  @Mutation(() => Boolean, { name: 'removePlan' })
  async removePlan(@ExtractUserFromRequest() user: User, @Args('planId') planId: string) {
    return this.planService.removePlan(user, planId);
  }
}
