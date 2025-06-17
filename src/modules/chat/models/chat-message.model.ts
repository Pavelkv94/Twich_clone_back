import { Field, ObjectType } from "@nestjs/graphql";
import { ChatMessage } from "@prisma/generated/client";
import { UserModel } from "../../auth/account/models/user.model";
import { StreamModel } from "../../stream/models/stream.model";

@ObjectType()
export class ChatMessageModel implements ChatMessage {
    @Field(() => String)
    id: string;

    @Field(() => String)
    message: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => StreamModel)
    stream: StreamModel;

    @Field(() => UserModel)
    user: UserModel;

    @Field(() => String)
    streamId: string;

    @Field(() => String)
    userId: string;
}