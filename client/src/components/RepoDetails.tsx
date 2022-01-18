import { useEffect, useMemo, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import { GitHubRepoTreeNodeType, RepoDetailsQuery } from '../generated/graphql';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { bytesToHumanReadable } from '../formatters/bytesToHumanReadable';

type GitHubRepoTreeNodeForDetailsPage = RepoDetailsQuery['repoDetails']['fileInfo']['treeNodes'][0];

export const REPO_DETAILS_QUERY = gql`
    query RepoDetails($name: String!) {
        repoDetails(name: $name) {
            name
            size
            owner {
                id
                login
            }
            private
            activeWebhooks {
                name
            }
            fileInfo {
                count
                yamlContent
                treeNodes {
                    path
                    type
                    size
                }
            }
        }
    }
`;

type OpenTreeStates = Record<string, boolean>;

export function RepoDetails() {
    const { name } = useParams<{ name: string }>();

    const [{ data: repoDetailsQuery, fetching, error }] = useQuery<RepoDetailsQuery>({
        query: REPO_DETAILS_QUERY,
        variables: { name },
    });

    const [openTreeStates, setOpenTreeStates] = useState<OpenTreeStates>({});

    const trees = useMemo(() => {
        return (
            repoDetailsQuery?.repoDetails.fileInfo.treeNodes.filter(
                (node) => node.type === GitHubRepoTreeNodeType.Tree,
            ) || []
        );
    }, [repoDetailsQuery?.repoDetails.fileInfo.treeNodes]);

    // seed states
    useEffect(() => {
        const openTreeStates = trees.reduce((state, node) => {
            state[node.path] = false;
            return state;
        }, {} as OpenTreeStates);
        setOpenTreeStates(openTreeStates ?? {});
    }, [trees]);

    const handleTreeClick = (path: string) => () => {
        const previousState = openTreeStates[path];
        const childrenState =
            // collapse children when closing tree
            previousState === true
                ? trees
                      .filter((node) => node.path.startsWith(path))
                      .map((node) => node.path)
                      .reduce((childrenOpenTreeStates, path) => {
                          childrenOpenTreeStates[path] = false;
                          return childrenOpenTreeStates;
                      }, {} as OpenTreeStates)
                : {};

        const newState = {
            ...openTreeStates,
            [path]: !previousState,
            ...childrenState,
        };
        setOpenTreeStates(newState);
    };

    if (fetching)
        return (
            <Grid container justifyContent="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    if (repoDetailsQuery === undefined) return <div>Couldn't fetch repo details for {name}</div>;
    if (error) return <pre>{error.message}</pre>;

    const { repoDetails } = repoDetailsQuery;

    const renderYamlAccordion = () => (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>YAML</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {repoDetails.fileInfo.yamlContent ? (
                    <code
                        style={{
                            display: 'block',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {repoDetails.fileInfo.yamlContent}
                    </code>
                ) : (
                    <Box sx={{ fontFamily: 'Monospace' }}>¯\_(ツ)_/¯</Box>
                )}
            </AccordionDetails>
        </Accordion>
    );

    const sortedTreeNodes = [...repoDetails.fileInfo.treeNodes].sort((nodeA, nodeB) => {
        if (nodeA.type === GitHubRepoTreeNodeType.Tree && nodeA.type === nodeB.type) return 0;
        if (nodeA.type === GitHubRepoTreeNodeType.Tree) return -1;
        return 1;
    });

    const getSingleLevelNodesByRoot = (root?: GitHubRepoTreeNodeForDetailsPage) => {
        if (!root) {
            return sortedTreeNodes.filter((node) => node.path.match(/\//g) === null);
        }
        const rootSlashMatch = root.path.match(/\//g);
        const rootDepth = rootSlashMatch === null ? 1 : rootSlashMatch.length + 1;
        return sortedTreeNodes.filter(
            (node) => node.path.startsWith(root.path) && (node.path.match(/\//g)?.length ?? -Infinity) === rootDepth,
        );
    };

    const renderTreeNode = (node: GitHubRepoTreeNodeForDetailsPage) => (
        <Accordion
            key={node.path}
            onChange={handleTreeClick(node.path)}
            expanded={openTreeStates[node.path] ?? false}
            disableGutters
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <FolderIcon />
                {node.path.split('/').at(-1)}
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction="column">
                    {openTreeStates[node.path] === true && getSingleLevelNodesByRoot(node).map(renderNode)}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );

    const renderBlobNode = (node: GitHubRepoTreeNodeForDetailsPage) => (
        <Paper sx={{ padding: 2 }} elevation={0} key={node.path}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item container alignItems="center" xs="auto">
                    <InsertDriveFileIcon />
                    {node.path.split('/').at(-1)}
                </Grid>
                <Grid item>{bytesToHumanReadable(node?.size ?? 0)}</Grid>
            </Grid>
        </Paper>
    );

    const renderNode = (node: GitHubRepoTreeNodeForDetailsPage) =>
        node.type === GitHubRepoTreeNodeType.Tree ? renderTreeNode(node) : renderBlobNode(node);

    const renderNodesAccordion = () => (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{'Repository content'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction="column">
                    <Box sx={{ fontFamily: 'Monospace' }}>{getSingleLevelNodesByRoot().map(renderNode)}</Box>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );

    return (
        <Grid container spacing={2} direction="column">
            <Grid item>
                <Paper elevation={2}>
                    <Box p={2}>
                        <Typography variant="body1">Name: {repoDetails.name}</Typography>
                        <Typography variant="body1">Size: {bytesToHumanReadable(repoDetails.size * 1024)}</Typography>
                        <Typography variant="body1">Owner: {repoDetails.owner.login}</Typography>
                        <Typography variant="body1">Private: {String(repoDetails.private)}</Typography>
                        <Typography variant="body1">
                            Active webhooks count: {repoDetails.activeWebhooks.length}
                        </Typography>
                        <Typography variant="body1">File count: {repoDetails.fileInfo.count}</Typography>
                    </Box>
                    {renderYamlAccordion()}
                    {renderNodesAccordion()}
                </Paper>
            </Grid>
        </Grid>
    );
}
