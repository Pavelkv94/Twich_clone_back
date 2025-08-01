import { Stream } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";
import { CategoryModel } from "../../category/models/category.model";

@ObjectType()
export class StreamModel implements Stream {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    thumbnailUrl: string | null;

    @Field(() => String, { nullable: true })
    ingressId: string | null;

    @Field(() => String, { nullable: true })
    serverUrl: string | null;

    @Field(() => String, { nullable: true })
    streamKey: string | null;

    @Field(() => Boolean)
    isLive: boolean;

    @Field(() => String)
    userId: string;

    @Field(() => UserModel)
    user: UserModel;

    @Field(() => CategoryModel, { nullable: true })
    category: CategoryModel | null;

    @Field(() => String, { nullable: true })
    categoryId: string | null;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => Boolean)
    isChatEnabled: boolean;

    @Field(() => Boolean)
    isChatFollowersOnly: boolean;

    @Field(() => Boolean)
    isChatPremiumFollowersOnly: boolean;
}