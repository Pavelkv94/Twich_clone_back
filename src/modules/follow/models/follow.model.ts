import { Field, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";
import { Follow } from "@/prisma/generated";

@ObjectType()
export class FollowModel implements Follow {
    @Field(() => String)
    id: string;

    @Field(() => UserModel)
    follower: UserModel;

    @Field(() => UserModel)
    following: UserModel;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => String)
    followerId: string;

    @Field(() => String)
    followingId: string;
}