import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SessionModel } from "../../session/models/session.model";
import { User } from "@prisma/generated";
import { SocialLinkModel } from "../../profile/models/social-link.model";
import { StreamModel } from "@/src/modules/stream/models/stream.model";
import { FollowModel } from "@/src/modules/follow/models/follow.model";
import { NotificationSettingsModel } from "@/src/modules/notification/models/notification-settings.model";
import { NotificationModel } from "@/src/modules/notification/models/notification.model";
import { PlanModel } from "@/src/modules/sponsorship/plan/models/plan.model";
import { SubscriptionModel } from "@/src/modules/sponsorship/subscription/models/subscription.model";

@ObjectType()
export class UserModel implements User {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => String)
    username: string;

    @Field(() => String)
    displayName: string;

    @Field(() => String, { nullable: true })
    avatar: string | null;

    @Field(() => String, { nullable: true })
    bio: string | null;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => Boolean)
    isVerified: boolean;

    @Field(() => Boolean)
    isEmailVerified: boolean;

    @Field(() => Boolean)
    isTotpEnabled: boolean;

    @Field(() => String, { nullable: true })
    totpSecret: string | null;

    @Field(() => Boolean)
    isDeactivated: boolean;

    @Field(() => Date, { nullable: true })
    deactivatedAt: Date | null;

    @Field(() => [SessionModel], { nullable: true })
    sessions?: SessionModel[] | null;

    @Field(() => [SocialLinkModel], { nullable: true })
    socialLinks?: SocialLinkModel[] | null;

    @Field(() => StreamModel, { nullable: true })
    stream?: StreamModel | null;

    @Field(() => [FollowModel], { nullable: true })
    followings?: FollowModel[] | null;

    @Field(() => [FollowModel], { nullable: true })
    followers?: FollowModel[] | null;

    @Field(() => [PlanModel], { nullable: true })
    sponsorshipPlans?: PlanModel[] | null;

    @Field(() => [SubscriptionModel], { nullable: true })
    sponsorshipSubscriptions?: SubscriptionModel[] | null;

    @Field(() => String, { nullable: true })
    telegramId: string | null;

    @Field(() => NotificationSettingsModel, { nullable: true })
    notificationSettings?: NotificationSettingsModel | null;

    @Field(() => [NotificationModel], { nullable: true })
    notifications?: NotificationModel[] | null;
}