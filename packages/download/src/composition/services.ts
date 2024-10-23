import { last, split } from 'lodash';
import { rootDir } from '../rootDir';
import { ArgParser } from '../services/ArgParser';
import { Downloader } from '../services/Downloader';
import { GithubApi } from '../services/GithubApi';
import { Handler } from '../services/Handler';
import { Logger } from '../services/Logger';
import { OmdbApi } from '../services/OmdbApi';
import { SubdlApi } from '../services/SubdlApi';
import { getPkgMeta } from '../utils/getPkgMeta';
import { config } from './config';

const pkgMeta = getPkgMeta(rootDir);
const logPrefix = <string>last(split(pkgMeta.name, '/'));

const gitHubPublicToken = config.gitHub.token;
const gitHubApiUrlBase = config.gitHub.apiUrlBase;
const omdbToken = config.omdb.token;
const omdbApiUrlBase = config.omdb.apiUrlBase;
const subdlToken = config.subdl.token;
const subdlApiUrlBase = config.subdl.apiUrlBase;
const subdlZipUrlBase = config.subdl.zipUrlBase;

export const makeLogger = (verbose: boolean) => new Logger(logPrefix, verbose);
export const gitHubApi = new GithubApi(gitHubApiUrlBase, gitHubPublicToken);
export const omdbApi = new OmdbApi(omdbApiUrlBase, omdbToken);
export const subdlApi = new SubdlApi(subdlApiUrlBase, subdlZipUrlBase, subdlToken);

export const handler = (verbose: boolean) => {
  const logger = makeLogger(verbose);
  return new Handler(new ArgParser(logger), new Downloader(gitHubApi, omdbApi, subdlApi, logger), logger);
};
