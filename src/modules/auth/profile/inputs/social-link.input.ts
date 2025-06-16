import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString, MaxLength } from "class-validator";
import { IsNotEmpty } from "class-validator";

@InputType()
export class SocialLinkInput {
    @Field(() => String)
    @IsNotEmpty()
    @MaxLength(20)
    @IsString()
    title: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    url: string;
}

@InputType()
export class SocialLinkOrderInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => Number)
    @IsNotEmpty()
    @IsNumber()
    position: number;
}