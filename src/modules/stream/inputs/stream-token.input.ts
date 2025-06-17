import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class StreamTokenInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    userId: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    channelId: string;
}