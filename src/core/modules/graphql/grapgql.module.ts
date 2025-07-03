import { ApolloDriver } from "@nestjs/apollo";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { GraphqlConfig } from "./graphql.config";
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

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
                uploads: true
            }),
            inject: [GraphqlConfig],
        })
    ],
    providers: [GraphqlConfig],
    exports: [GraphqlConfig],
})
export class GraphqlConfiguredModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }))
            .forRoutes('graphql');
    }
}