import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { IsEmail } from "class-validator";
import { IsNotEmpty } from "class-validator";

@InputType()
export class ChangeEmailInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

}