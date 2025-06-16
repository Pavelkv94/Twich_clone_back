import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, Min, MinLength } from "class-validator";
import { IsString } from "class-validator";

@InputType()
export class ChangePassInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}