import { createClient } from 'urql';

export const graphqlClient = createClient({
    url: 'http://localhost:4000/graphql/',
});
