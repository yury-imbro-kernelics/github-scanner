import { GitHubRepo, GraphQLContext } from '../types/index.js';

export const resolvers = {
    Query: {
        repos: async (_ = {}, __ = {}, { gitHubService }: GraphQLContext) => {
            return gitHubService.getAllRepos();
        },
        repoDetails: async (_ = {}, { name }: { name: string }, { gitHubService }: GraphQLContext) => {
            return await gitHubService.getRepo(name);
        },
    },
    GitHubRepoDetails: {
        activeWebhooks({ name }: GitHubRepo, _ = {}, { gitHubService }: GraphQLContext) {
            return gitHubService.getRepoActiveWebhooks(name);
        },
        fileInfo({ name }: GitHubRepo, _ = {}, { gitHubService }: GraphQLContext) {
            return gitHubService.getRepoFileInfo(name);
        },
    },
};
