import { SponsorshipSubscription } from "@/prisma/generated";
import { UserModel } from "@/src/modules/auth/account/models/user.model";
import { Field, ObjectType } from "@nestjs/graphql";
import { PlanModel } from "../../plan/models/plan.model";

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {

    @Field(() => String)
    id: string;

    @Field(() => String)
    channelId: string;

    @Field(() => Date)
    expiresAt: Date;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => String)
    planId: string;

    @Field(() => String)
    userId: string;

    @Field(() => PlanModel)
    plan: PlanModel;

    @Field(() => UserModel)
    user: UserModel;

    @Field(() => UserModel)
    channel: UserModel;
}