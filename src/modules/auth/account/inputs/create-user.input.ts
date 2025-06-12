import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsNotEmpty({
        message: 'Username is required',
    })
    @IsString({
        message: 'Username must be a string',
    })
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username must contain only letters, numbers, underscores and hyphens',
    })
    username: string;

    @Field(() => String)
    @IsEmail({}, {
        message: 'Email must be a valid email',
    })
    @IsNotEmpty({
        message: 'Email is required',
    })
    @IsString({
        message: 'Email must be a string',
    })
    email: string;

    @Field(() => String)
    @IsNotEmpty({
        message: 'Set Env variable PASSWORD, example: secret',
    })
    @IsString({
        message: 'Password must be a string',
    })
    @MinLength(8, {
        message: 'Password must be at least 8 characters long',
    })
    password: string;
}