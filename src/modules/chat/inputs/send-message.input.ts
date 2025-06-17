import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

@InputType()
export class SendMessageInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    text: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    streamId: string;
}