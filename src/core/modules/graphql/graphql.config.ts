import { configValidationUtility } from "@/src/shared/utils/env-validation.utility";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class GraphqlConfig {
    @IsNotEmpty({
        message: 'Set Env variable GRAPHQL_PATH, example: /graphql',
    })
    graphqlPath: string;
    isGraphqlPlaygroundEnabled: boolean;

    constructor(private configService: ConfigService) {
        this.graphqlPath = this.configService.get<string>('GRAPHQL_PATH') as string;
        this.isGraphqlPlaygroundEnabled = this.configService.getOrThrow<string>('NODE_ENV') === 'development';
        configValidationUtility.validateConfig(this);
    }
}
