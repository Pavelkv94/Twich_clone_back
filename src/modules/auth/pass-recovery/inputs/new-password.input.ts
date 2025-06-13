import { IsPasswordMatch } from "@/src/shared/decorators/validations/password.validation";
import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID, MinLength, Validate } from "class-validator";
import { IsEmail } from "class-validator";

@InputType()
export class NewPasswordInput {

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Validate(IsPasswordMatch)
    confirmPassword: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    token: string;

}