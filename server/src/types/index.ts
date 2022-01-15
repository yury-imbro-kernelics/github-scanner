import { GitHubService } from '../services/github';

export interface GraphQLContext {
    gitHubService: GitHubService;
}

export interface GitHubUser {
    login: string;
    id: number;
}

export interface GitHubRepo {
    id: number;
    name: string;
    size: number;
    private: boolean;
    owner: GitHubUser;
}

export interface GitHubRepoFileInfo {
    count: number;
    yamlContent: string | null;
    treeNodes: GitHubRepoTreeNode[];
}

export interface GitHubRepoWebhook {
    type: string;
    id: number;
    name: string;
    active: boolean;
}

export interface GitHubRepoBranch {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
}

export enum GitHubRepoTreeNodeType {
    blob = 'blob',
    tree = 'tree',
}

export interface GitHubRepoTreeNode {
    path?: string | undefined;
    mode?: string | undefined;
    type?: GitHubRepoTreeNodeType | undefined;
    sha?: string | undefined;
    size?: number | undefined;
    url?: string | undefined;
}

export interface GitHubRepoTreeData {
    sha: string;
    url: string;
    truncated: boolean;
    tree: GitHubRepoTreeNode[];
}

export enum GitHubContentItemType {
    dir = 'dir',
    file = 'file',
    symlink = 'symlink',
    submodule = 'submodule',
}

export interface GitHubContentItem {
    type: GitHubContentItemType;
    size: number;
    name: string;
    path: string;
    url: string;
    content?: string;
}
