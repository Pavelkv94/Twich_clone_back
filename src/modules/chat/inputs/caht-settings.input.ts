import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChatSettingsInput {
    @Field(() => Boolean)
    isChatEnabled: boolean;

    @Field(() => Boolean)
    isChatFollowersOnly: boolean;

    @Field(() => Boolean)
    isChatPremiumFollowersOnly: boolean;
}