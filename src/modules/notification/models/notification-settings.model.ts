import { NotificationSettings } from "@/prisma/generated";
import { Field, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {

    @Field(() => String)
    id: string;

    @Field(() => Boolean)
    siteNotification: boolean;

    @Field(() => Boolean)
    telegramNotification: boolean;

    @Field(() => UserModel)
    user: UserModel;

    @Field(() => String)
    userId: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

@ObjectType()
export class ChangeNotificationSettingsResponse {
    @Field(() => NotificationSettingsModel)
    notificationSettings: NotificationSettingsModel;

    @Field(() => String, { nullable: true })
    telegramAuthToken?: string | null;
}