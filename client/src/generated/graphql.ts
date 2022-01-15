export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GitHubRepo = IGitHubRepo & {
  __typename?: 'GitHubRepo';
  name: Scalars['String'];
  owner: GitHubUser;
  size: Scalars['Int'];
};

export type GitHubRepoDetails = IGitHubRepo & {
  __typename?: 'GitHubRepoDetails';
  activeWebhooks: Array<GitHubWebHook>;
  fileInfo: GitHubRepoFileInfo;
  name: Scalars['String'];
  owner: GitHubUser;
  private: Scalars['Boolean'];
  size: Scalars['Int'];
};

export type GitHubRepoFileInfo = {
  __typename?: 'GitHubRepoFileInfo';
  count: Scalars['Int'];
  treeNodes: Array<GitHubRepoTreeNode>;
  yamlContent?: Maybe<Scalars['String']>;
};

export type GitHubRepoTreeNode = {
  __typename?: 'GitHubRepoTreeNode';
  mode?: Maybe<Scalars['String']>;
  path: Scalars['String'];
  sha?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  type: GitHubRepoTreeNodeType;
  url?: Maybe<Scalars['String']>;
};

export enum GitHubRepoTreeNodeType {
  Blob = 'blob',
  Tree = 'tree'
}

export type GitHubUser = {
  __typename?: 'GitHubUser';
  id: Scalars['Int'];
  login: Scalars['String'];
};

export type GitHubWebHook = {
  __typename?: 'GitHubWebHook';
  name: Scalars['String'];
};

export type IGitHubRepo = {
  name: Scalars['String'];
  owner: GitHubUser;
  size: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  repoDetails: GitHubRepoDetails;
  repos: Array<GitHubRepo>;
};


export type QueryRepoDetailsArgs = {
  name: Scalars['String'];
};

export type RepoDetailsQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type RepoDetailsQuery = { __typename?: 'Query', repoDetails: { __typename?: 'GitHubRepoDetails', name: string, size: number, private: boolean, owner: { __typename?: 'GitHubUser', id: number, login: string }, activeWebhooks: Array<{ __typename?: 'GitHubWebHook', name: string }>, fileInfo: { __typename?: 'GitHubRepoFileInfo', count: number, yamlContent?: string | null | undefined, treeNodes: Array<{ __typename?: 'GitHubRepoTreeNode', path: string, mode?: string | null | undefined, type: GitHubRepoTreeNodeType, sha?: string | null | undefined, size?: number | null | undefined, url?: string | null | undefined }> } } };

export type ReposQueryVariables = Exact<{ [key: string]: never; }>;


export type ReposQuery = { __typename?: 'Query', repos: Array<{ __typename?: 'GitHubRepo', name: string, size: number, owner: { __typename?: 'GitHubUser', id: number, login: string } }> };
