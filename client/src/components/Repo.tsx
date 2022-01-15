import { IGitHubRepo } from '../generated/graphql';
import { Box } from '@mui/system';
import { Paper, Typography, Link as MUILink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { bytesToHumanReadable } from '../formatters/bytesToHumanReadable';

export function Repo({ repo }: { repo: IGitHubRepo }) {
    return (
        <Paper elevation={2}>
            <Box p={2}>
                <Typography variant="body1">Name: {repo.name}</Typography>
                <Typography variant="body1">Size: {bytesToHumanReadable(repo.size * 1024)}</Typography>
                <Typography variant="body1">Owner: {repo.owner.login}</Typography>
                <MUILink component={RouterLink} to={`/repo/${repo.name}`}>
                    See details
                </MUILink>
            </Box>
        </Paper>
    );
}
