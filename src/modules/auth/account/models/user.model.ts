import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SessionModel } from "../../session/models/session.model";
import { User } from "@prisma/generated";

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
}