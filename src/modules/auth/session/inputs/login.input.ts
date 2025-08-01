import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

@InputType()
export class LoginInput {

    @Field(() => String)
    @IsNotEmpty({
        message: 'Login is required',
    })
    @IsString({
        message: 'Login must be a string',
    })
    login: string;

    @Field(() => String)
    @IsNotEmpty({
        message: 'Password is required',
    })
    @IsString({
        message: 'Password must be a string',
    })
    @MinLength(8, {
        message: 'Password must be at least 8 characters long',
    })
    password: string;

    @Field(() => String, { nullable: true })
    @IsString({
        message: 'TOTP code is required',
    })
    @Length(6, 6)
    @IsOptional()
    totpPin?: string;
}