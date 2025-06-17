import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { GraphqlConfig } from "./graphql.config";

@Module({
    imports: [
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule, GraphqlConfiguredModule],
            useFactory: (graphqlConfig: GraphqlConfig) => ({
                driver: ApolloDriver,
                playground: graphqlConfig.isGraphqlPlaygroundEnabled,
                path: graphqlConfig.graphqlPath,
                autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
                sortSchema: true,
                context: ({ req, res }) => ({ req, res }),
                installSubscriptionHandlers: true,
            }),
            inject: [GraphqlConfig],
        })
    ],
    providers: [GraphqlConfig],
    exports: [GraphqlConfig],
})
export class GraphqlConfiguredModule { }