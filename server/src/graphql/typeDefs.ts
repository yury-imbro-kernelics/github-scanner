import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`
    type GitHubUser {
        id: Int!
        login: String!
    }
    interface IGitHubRepo {
        name: String!
        size: Int!
        owner: GitHubUser!
    }
    type GitHubRepo implements IGitHubRepo {
        name: String!
        size: Int!
        owner: GitHubUser!
    }
    type GitHubWebHook {
        name: String!
    }
    enum GitHubRepoTreeNodeType {
        blob
        tree
    }
    type GitHubRepoTreeNode {
        path: String!
        type: GitHubRepoTreeNodeType!
        mode: String
        sha: String
        size: Int
        url: String
    }
    type GitHubRepoFileInfo {
        count: Int!
        yamlContent: String
        treeNodes: [GitHubRepoTreeNode!]!
    }
    type GitHubRepoDetails implements IGitHubRepo {
        name: String!
        size: Int!
        owner: GitHubUser!
        private: Boolean!
        activeWebhooks: [GitHubWebHook!]!
        fileInfo: GitHubRepoFileInfo!
    }
    type Query {
        repos: [GitHubRepo!]!
        repoDetails(name: String!): GitHubRepoDetails!
    }
`);
