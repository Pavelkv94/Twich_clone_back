import { Field, Float, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class CreatePlanInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    title: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    price: number;
}