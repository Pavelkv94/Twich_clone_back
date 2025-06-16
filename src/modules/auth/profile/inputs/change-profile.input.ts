import { Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { InputType } from "@nestjs/graphql";
import { IsString, Matches } from "class-validator";

@InputType()
export class ChangeProfileInput {
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
    @IsNotEmpty({
        message: 'Display name is required',
    })
    @IsString({
        message: 'Display name must be a string',
    })
    @MaxLength(20, {
        message: 'Display name must be less than 20 characters',
    })
    displayName: string;


    @Field(() => String)
    @IsOptional()
    @IsString({
        message: 'Bio must be a string',
    })
    @MaxLength(300, {
        message: 'Bio must be less than 300 characters',
    })
    bio: string;
}