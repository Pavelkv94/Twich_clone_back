import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

@ObjectType()
export class TokenModel {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    token: string;
}