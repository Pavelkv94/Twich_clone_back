import { isDev } from '@/src/shared/utils/is-dev.util';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
    return {
        driver: ApolloDriver,
        playground: isDev(configService),
        path: configService.getOrThrow<string>('GRAPHQL_PATH'),
        autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
        sortSchema: true,
        context: ({ req, res }) => ({ req, res }),
    };
}