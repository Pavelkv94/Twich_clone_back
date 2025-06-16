import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

@InputType()
export class DeactivateAccountInput {

    @Field(() => String)
    @IsNotEmpty({
        message: 'Login is required',
    })
    @IsString({
        message: 'Login must be a string',
    })
    @IsEmail({}, {
        message: 'Email must be a valid email',
    })
    email: string;

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