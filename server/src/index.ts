import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { GitHubService } from './services/github/index.js';
import { GraphQLContext } from './types/index.js';

const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

const gitHubService = new GitHubService();

const app = express();

app.use(cors());
app.use(
    '/graphql',
    graphqlHTTP(async () => {
        try {
            await gitHubService.init();
        } catch (e) {
            throw new Error(`[GraphQL] Unable to initialize GraphQL context due to GitHub API error: ${e}`);
        }

        const context: GraphQLContext = {
            gitHubService,
        };

        return {
            schema: schema,
            graphiql: true,
            context,
        };
    }),
);

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');
