import { useQuery, gql } from 'urql';
import { ReposQuery } from '../generated/graphql';
import { CircularProgress, Grid } from '@mui/material';
import { Repo } from './Repo';

export const REPOS_QUERY = gql`
    query Repos {
        repos {
            name
            size
            owner {
                id
                login
            }
        }
    }
`;

export function Repos() {
    const [{ data: reposQuery, fetching, error }] = useQuery<ReposQuery>({
        query: REPOS_QUERY,
    });

    if (fetching)
        return (
            <Grid container justifyContent="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    if (reposQuery === undefined) return <div>Couldn't fetch repos</div>;
    if (error) return <pre>{error.message}</pre>;

    return (
        <Grid container item spacing={2} direction="column">
            {reposQuery.repos.map((repo) => (
                <Grid item key={repo.name}>
                    <Repo repo={repo} />
                </Grid>
            ))}
        </Grid>
    );
}
