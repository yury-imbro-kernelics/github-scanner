import { queue, QueueObject } from 'async';
import { GitHubAPI } from '../../apis/github/index.js';
import {
    GitHubContentItemType,
    GitHubRepo,
    GitHubRepoFileInfo,
    GitHubRepoTreeNodeType,
    GitHubUser,
    GitHubRepoWebhook,
    GitHubRepoTreeData,
} from '../../types/index.js';
import { GITHUB_ACCESS_TOKEN } from '../../consts.js';

export class GitHubService {
    private api: GitHubAPI;
    private user: GitHubUser | null;
    private repoFileInfoQueue: QueueObject<string>;
    private repoFileInfoQueueConcurrency = 2;

    constructor() {
        this.api = new GitHubAPI(GITHUB_ACCESS_TOKEN);
        this.user = null;
        this.repoFileInfoQueue = queue(
            this.getRepoFileInfo_Implementation.bind(this),
            this.repoFileInfoQueueConcurrency,
        );
    }

    async init(): Promise<void> {
        if (this.user !== null) return;

        this.user = await this.api.getCurrentUser();
    }

    async getAllRepos(): Promise<GitHubRepo[]> {
        return this.api.getAllRepos();
    }

    async getRepo(name: string): Promise<GitHubRepo> {
        if (this.user === null) throw new Error('[GitHubService] uninitialized');

        return this.api.getRepo(this.user.login, name);
    }

    async getRepoActiveWebhooks(name: string): Promise<GitHubRepoWebhook[]> {
        if (this.user === null) throw new Error('[GitHubService] uninitialized');

        const webhooks = await this.api.getRepoWebhooks(this.user.login, name);

        return webhooks.filter((webhook) => webhook.active);
    }

    // wrapper around actual implementation that enqueues a task
    async getRepoFileInfo(name: string): Promise<GitHubRepoFileInfo> {
        if (this.user === null) throw new Error('[GitHubService] uninitialized');

        return this.repoFileInfoQueue.pushAsync<GitHubRepoFileInfo>(name);
    }

    private async getRepoFileInfo_Implementation(name: string): Promise<GitHubRepoFileInfo> {
        if (this.user === null) throw new Error('[GitHubService] uninitialized');

        const treeData = await this.getRepoTreeData(name);
        const blobNodes = treeData.tree.filter((node) => node.type === GitHubRepoTreeNodeType.blob);

        const yamlExtensions = ['yml', 'yaml'];
        const yamlNode = blobNodes.find((node) => yamlExtensions.includes(node.path?.split('.')?.at(-1) ?? ''));
        const yamlContent = yamlNode ? await this.getYamlFileContent(name, yamlNode.path) : null;

        return {
            count: blobNodes.length,
            yamlContent,
            treeNodes: treeData.tree,
        };
    }

    private async getYamlFileContent(name: string, path = ''): Promise<string | null> {
        if (this.user === null) throw new Error('[GitHubService] uninitialized');

        const contentItem = await this.api.getRepoContent(this.user.login, name, path);

        if (Array.isArray(contentItem) || contentItem.type !== GitHubContentItemType.file) {
            throw new Error(
                `[GitHubService] getYamlFileContent - content returned is not a file. Repo: ${name}, path: ${path}`,
            );
        }

        if (contentItem.content === undefined) return null;

        return Buffer.from(contentItem.content, 'base64').toString();
    }

    private async getRepoTreeData(name: string): Promise<GitHubRepoTreeData> {
        if (this.user === null) throw new Error('[GitHubService] uninitialized');

        const branches = await this.api.getAllRepoBranches(this.user.login, name);

        const { commit } =
            branches.find((branch) => branch.name === 'main') ||
            branches.find((branch) => branch.name === 'master') ||
            branches[0];

        const { sha } = commit;

        return this.api.getRepoTreeData(this.user.login, name, sha, true);
    }
}
