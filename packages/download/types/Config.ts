export interface GitHubConfig {
  token: string;
  apiUrlBase: string;
}

export interface OmdbConfig {
  token: string;
  apiUrlBase: string;
}

export interface SubdlConfig {
  token: string;
  apiUrlBase: string;
  zipUrlBase: string;
}

export interface Config {
  gitHub: GitHubConfig;
  omdb: OmdbConfig;
  subdl: SubdlConfig;
}
