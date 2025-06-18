import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class NotificationSettingsInput {
    @Field(() => Boolean)
    siteNotification: boolean;

    @Field(() => Boolean)
    telegramNotification: boolean;
}