import { Octokit } from '@octokit/core';
import {
    GitHubContentItem,
    GitHubContentItemType,
    GitHubRepo,
    GitHubRepoBranch,
    GitHubRepoTreeData,
    GitHubRepoTreeNode,
    GitHubUser,
    GitHubRepoWebhook,
} from '../../types/index.js';

export class GitHubAPI {
    octokit: Octokit;

    constructor(accessToken: string) {
        this.octokit = new Octokit({ auth: accessToken });
    }

    async getCurrentUser(): Promise<GitHubUser> {
        const { data: user } = await this.octokit.request('GET /user');

        return {
            id: user.id,
            login: user.login,
        };
    }

    async getAllRepos(): Promise<GitHubRepo[]> {
        const { data: repos } = await this.octokit.request('GET /user/repos');

        return repos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            size: repo.size,
            private: repo.private,
            owner: {
                id: repo.owner.id,
                login: repo.owner.login,
            },
        }));
    }

    async getRepo(owner: string, name: string): Promise<GitHubRepo> {
        const { data: repo } = await this.octokit.request('GET /repos/{owner}/{repo}', {
            owner: owner,
            repo: name,
        });

        return {
            id: repo.id,
            name: repo.name,
            size: repo.size,
            private: repo.private,
            owner: {
                id: repo.owner.id,
                login: repo.owner.login,
            },
        };
    }

    async getAllRepoBranches(owner: string, name: string): Promise<GitHubRepoBranch[]> {
        const { data: branches } = await this.octokit.request('GET /repos/{owner}/{repo}/branches', {
            owner,
            repo: name,
        });

        return branches.map((branch) => ({
            name: branch.name,
            commit: branch.commit,
        }));
    }

    async getRepoTreeData(owner: string, name: string, sha: string, recursive = false): Promise<GitHubRepoTreeData> {
        const { data: treeData } = await this.octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
            owner,
            repo: name,
            tree_sha: sha,
            recursive: recursive ? 'true' : undefined,
        });

        return {
            ...treeData,
            tree: treeData.tree as GitHubRepoTreeNode[],
        };
    }

    async getRepoWebhooks(owner: string, name: string): Promise<GitHubRepoWebhook[]> {
        const { data: hooks } = await this.octokit.request('GET /repos/{owner}/{repo}/hooks', {
            owner,
            repo: name,
        });

        return hooks.map((hook) => ({
            type: hook.type,
            id: hook.id,
            name: hook.name,
            active: hook.active,
        }));
    }

    async getRepoContent(owner: string, name: string, path: string): Promise<GitHubContentItem | GitHubContentItem[]> {
        const { data: content } = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo: name,
            path: path,
        });

        return Array.isArray(content)
            ? content.map((item) => ({
                  type: item.type as GitHubContentItemType,
                  size: item.size,
                  name: item.name,
                  path: item.path,
                  url: item.url,
              }))
            : {
                  type: content.type as GitHubContentItemType,
                  size: content.size,
                  name: content.name,
                  path: content.path,
                  url: content.url,
                  content: 'content' in content ? content.content : undefined,
              };
    }
}
