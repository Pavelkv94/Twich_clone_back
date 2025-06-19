import { SponsorshipPlan } from "@/prisma/generated/client";
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PlanModel implements SponsorshipPlan {
    @Field(() => String)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description: string | null;

    @Field(() => Float)
    price: number;

    @Field(() => String)
    stripeProductId: string;

    @Field(() => String)
    stripePlanId: string;

    @Field(() => String)
    channelId: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}