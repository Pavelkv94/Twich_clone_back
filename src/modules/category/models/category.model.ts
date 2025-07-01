import { Field, ObjectType } from "@nestjs/graphql";
import { Category } from "@prisma/generated";
import { StreamModel } from "../../stream/models/stream.model";

@ObjectType()
export class CategoryModel implements Category {
    @Field(() => String)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => String)
    slug: string;

    @Field(() => String, { nullable: true })
    description: string | null;

    @Field(() => String, { nullable: true })
    thumbnailUrl: string | null;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => [StreamModel], { nullable: true })
    streams?: StreamModel[];
}