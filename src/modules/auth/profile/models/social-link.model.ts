import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SocialLink } from "@prisma/generated";

@ObjectType()
export class SocialLinkModel implements SocialLink {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => String)
    url: string;

    @Field(() => Number)
    position: number;

    @Field(() => String)
    userId: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}