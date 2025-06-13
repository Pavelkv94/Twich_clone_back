import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { IsEmail } from "class-validator";

@InputType()
export class ResetPassInput {

    @Field(() => String)
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
}