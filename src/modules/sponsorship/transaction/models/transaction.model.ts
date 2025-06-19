import { Transaction, TransactionStatus } from "@/prisma/generated/client";
import { UserModel } from "@/src/modules/auth/account/models/user.model";
import { Field, Float, ObjectType, registerEnumType } from "@nestjs/graphql";

registerEnumType(TransactionStatus, {
    name: 'TransactionStatus',
});


@ObjectType()
export class TransactionModel implements Transaction {
    @Field(() => String)
    id: string;

    @Field(() => Float)
    amount: number;

    @Field(() => String)
    currency: string;

    @Field(() => String)
    stripeSubscriptionId: string | null;

    @Field(() => TransactionStatus)
    status: TransactionStatus;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => String)
    userId: string;

    @Field(() => String)
    channelId: string;

    @Field(() => UserModel)
    user: UserModel;

}